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
    const date = new Date(2009, 10, 10);  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'short' });
    // const yearSpendData: {
    //     month: string;
    //     monthSpend: number;
    // }[] = []

    // const yearSpendData = [
    //     { month: month, monthsSpend: Math.random() },
    //     { month: "2", monthsSpend: 16500 },
    //     { month: "3", monthsSpend: 14250 },
    //     { month: "4", monthsSpend: 19000 }
    // ];

    const yearSpendData = await getListOfYearsTransactionsByMonth(userId)
    console.log(yearSpendData)


    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            <YearlySpendTrend yearSpendData={yearSpendData} />

        </div>
    );
}