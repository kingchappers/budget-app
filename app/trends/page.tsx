import { getServerSession } from 'next-auth/next';
import { getListOfYearsTransactionsByMonth } from '../components/trend-calculations';
import { YearlySpendTrend } from '../components/trend-graphs';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';

export default async function Trends() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;

    const {monthlySpendData} = await getListOfYearsTransactionsByMonth(userId)
    
    // console.log(monthlySpendData)

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            <YearlySpendTrend monthlySpendData={monthlySpendData} />

        </div>
    );
}