import { getServerSession } from 'next-auth/next';
import { getListOfYearsIncomeTotalsByMonth, getListOfYearsTransactionTotalsByMonth, getYearOfCategoryIncome, getYearOfCategorySpend } from '../components/trend-calculations';
import { MonthSpendingCategorySplit, YearlyIncomeVsSpendingGroupChart } from '../components/trend-graphs';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import { getLastTwelveMonths } from '../lib/utils';

export default async function Trends() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const months = getLastTwelveMonths()
    const userId = session.user.id;
    const { monthlySpendData } = await getListOfYearsTransactionTotalsByMonth(userId)
    const { monthlyIncomeData } = await getListOfYearsIncomeTotalsByMonth(userId)
    const { yearOfCategorySpend, results } = await getYearOfCategorySpend(userId, months)
    const { yearOfCategoryIncome, results: incomeResults } = await getYearOfCategoryIncome(userId, months)

    console.log(yearOfCategoryIncome)

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            <h1 className="text-xl font-bold mb-4">Income vs Expenses</h1>
            <YearlyIncomeVsSpendingGroupChart monthSpendData={monthlySpendData} monthIncomeData={monthlyIncomeData} />

            <h1 className="text-xl font-bold mb-4">Category Spending Per Month</h1>

            <div className="grid grid-cols-3">
                {results === 0 ? (
                    <p>No data found</p>
                ) : (
                    yearOfCategorySpend.map((monthOfCategorySpend) => (
                        <MonthSpendingCategorySplit categoryData={monthOfCategorySpend.categoryData} month={monthOfCategorySpend.month} monthTotal={monthOfCategorySpend.monthTotal} />
                    ))
                )}
            </div>

            <h1 className="text-xl font-bold mb-4">Category Income Per Month</h1>
            <div className="grid grid-cols-3">
                {results === 0 ? (
                    <p>No data found</p>
                ) : (
                    yearOfCategoryIncome.map((monthOfCategoryIncome) => (
                        <MonthSpendingCategorySplit categoryData={monthOfCategoryIncome.categoryData} month={monthOfCategoryIncome.month} monthTotal={monthOfCategoryIncome.monthTotal} />
                    ))
                )}
            </div>
        </div>
    );
}