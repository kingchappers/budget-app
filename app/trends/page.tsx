import { getServerSession } from 'next-auth/next';
import { getListOfYearsTransactionTotalsByMonth, getYearOfCategorySpend } from '../components/trend-spend-calculations';
import { getListOfYearsIncomeTotalsByMonth, getYearOfCategoryIncome } from '../components/trend-income-calculations';
import { MonthSpendingCategorySplit, YearlyIncomeVsSpendingGroupChart } from '../components/trend-graphs';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import { getLastTwelveMonths } from '../lib/utils';
import { createMonthlySpendAction, getMonthlySpendsBetweenDatesAction } from '../_monthlySpendActions';
import { getMonthlyIncomesBetweenDatesAction } from '../_monthlyIncomeActions';

export default async function Trends() {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //     redirect("/api/auth/signin");
    // }

    // const months = getLastTwelveMonths()
    // const userId = session.user.id;
    // const { monthlySpendData } = await getListOfYearsTransactionTotalsByMonth(userId)
    // const { monthlyIncomeData } = await getListOfYearsIncomeTotalsByMonth(userId)

    // //_______________________________________________________________________________________________________________________________________
    // // New Stuff below
    // //_______________________________________________________________________________________________________________________________________

    // const { monthlySpends, results: monthlySpendsResults } = await getMonthlySpendsBetweenDatesAction({ userId, startDate: months[0], endDate: months[months.length - 1] })
    // const { monthlyIncomes, results: monthlyIncomesResults } = await getMonthlyIncomesBetweenDatesAction({ userId, startDate: months[0], endDate: months[months.length - 1] })

    // if (monthlySpendsResults) {
    //     console.log("Spends found!")
    // } else {
    //     // If there are no entries in the spends trend table, create them!
    //     console.log("No spends found :(")
    //     const { monthlySpendData } = await getListOfYearsTransactionTotalsByMonth(userId)
    //     const spendsExist = monthlySpendData.some(item => item.value !== 0)
    //     if (spendsExist) {
    //         const { yearOfCategorySpend, results } = await getYearOfCategorySpend(userId, months)
    //         yearOfCategorySpend.map(async (monthOfCategorySpend) => (
    //             await createMonthlySpendAction({ month: monthOfCategorySpend.month, monthTotal: monthOfCategorySpend.monthTotal, monthCategoryTotals: monthOfCategorySpend.monthCategoryTotal, userId, path: "/" })
    //         ))
    //     } else {
    //         console.log("No transactions currently exist")
    //     }
    // }

    // if (monthlyIncomesResults) {
    //     console.log(monthlyIncomesResults)
    //     console.log("Incomes found!")
    // } else {
    //     console.log("No incomes found :(")
    // }

    //_______________________________________________________________________________________________________________________________________
    //_______________________________________________________________________________________________________________________________________
    //_______________________________________________________________________________________________________________________________________

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            <h1 className="text-xl font-bold mb-4">Income vs Expenses</h1>
            {/* <YearlyIncomeVsSpendingGroupChart monthSpendData={monthlySpendData} monthIncomeData={monthlyIncomeData} />

            <h1 className="text-xl font-bold mb-4">Category Spending Per Month</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3">
                {monthlySpendsResults === 0 ? (
                    <p>No data found</p>
                ) : (
                    monthlySpends?.map((monthOfCategorySpend) => (
                        <MonthSpendingCategorySplit monthCategoryTotal={monthOfCategorySpend.monthCategoryTotals} month={monthOfCategorySpend.month} monthTotal={monthOfCategorySpend.monthTotal} />
                    ))
                )}
            </div> */}

            <h1 className="text-xl font-bold mb-4">Category Income Per Month</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3">
            </div>
        </div>
    );
}