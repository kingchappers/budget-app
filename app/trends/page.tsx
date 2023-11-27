import { getServerSession } from 'next-auth/next';
import { getListOfYearsIncomeTotalsByMonth, getListOfYearsTransactionTotalsByMonth } from '../components/trend-calculations';
import { YearlyIncomeVsSpendingGroupChart } from '../components/trend-graphs';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';

export default async function Trends() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;
    const { monthlySpendData } = await getListOfYearsTransactionTotalsByMonth(userId)
    const { monthlyIncomeData } = await getListOfYearsIncomeTotalsByMonth(userId)

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            {/* <YearlySpendBarTrend monthlySpendData={monthlySpendData} />

            <YearlyIncomeBarTrend monthlyIncomeData={monthlyIncomeData} /> */}

            <h1 className="text-xl font-bold mb-4">Income vs Expenses</h1>
            <YearlyIncomeVsSpendingGroupChart monthSpendData={monthlySpendData} monthIncomeData={monthlyIncomeData} />

        </div>
    );
}