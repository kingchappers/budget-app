import { getServerSession } from 'next-auth/next';
import { getListOfYearsIncomesByMonth, getListOfYearsTransactionsByMonth } from '../components/trend-calculations';
import { YearlyIncomeBarTrend, YearlyIncomeVsSpendingGroupChart, YearlySpendBarTrend } from '../components/trend-graphs';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';

export default async function Trends() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;
    const { monthlySpendData } = await getListOfYearsTransactionsByMonth(userId)
    const { monthlyIncomeData } = await getListOfYearsIncomesByMonth(userId)

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            <YearlySpendBarTrend monthlySpendData={monthlySpendData} />

            <YearlyIncomeBarTrend monthlyIncomeData={monthlyIncomeData} />

            <YearlyIncomeVsSpendingGroupChart monthSpendData={monthlySpendData} monthIncomeData={monthlyIncomeData} />

        </div>
    );
}