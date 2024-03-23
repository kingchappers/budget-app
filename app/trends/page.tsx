import { getServerSession } from 'next-auth/next';
import { getListOfYearsIncomeTotalsByMonth, getListOfYearsTransactionTotalsByMonth, getYearOfCategoryIncome, getYearOfCategorySpend } from '../components/trend-calculations';
import { MonthSpendingCategorySplit, YearlyIncomeVsSpendingGroupChart } from '../components/trend-graphs';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import { getLastTwelveMonths } from '../lib/utils';
import { createMonthlySpendAction, getMonthlySpendsBetweenDatesAction } from '../_monthlySpendActions';
import { getMonthlyIncomesBetweenDatesAction } from '../_monthlyIncomeActions';
import { MonthlySpendFilter, getMonthlySpends } from '../lib/monthly-spend-db';

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

    //_______________________________________________________________________________________________________________________________________
    // REMOVE THESE LOG LINE
    //_______________________________________________________________________________________________________________________________________
    // console.log("Months collectect: " + months)
    // console.log("Monthly Spend Data:")
    // for (const element of monthlySpendData){
    //     console.log(element)
    // }

    // console.log("Monthly Income Data: ")
    // for (const element of monthlyIncomeData){
    //     console.log(element)
    // }

    // console.log("Year of Category Spend: ")
    // for (const element of yearOfCategorySpend){
    //     console.log(element)
    // }

    // console.log("Year of Category Income: ")
    // for (const element of yearOfCategoryIncome){
    //     console.log(element)
    // }
    //_______________________________________________________________________________________________________________________________________
    //_______________________________________________________________________________________________________________________________________

    //_______________________________________________________________________________________________________________________________________
    // New Stuff below
    //_______________________________________________________________________________________________________________________________________

    let monthlySpendFilter: MonthlySpendFilter = {
        userId: userId,
    }

    const { monthlySpends, results: monthlySpendsResults } = await getMonthlySpendsBetweenDatesAction({ userId, startDate: months[0], endDate: months[months.length - 1] })
    const { monthlyIncomes, results: monthlyIncomesResults } = await getMonthlyIncomesBetweenDatesAction({ userId, startDate: months[0], endDate: months[months.length - 1] })

    if (monthlySpendsResults) {
        console.log("Spends found!")
    } else {
        console.log("No spends found :(")
        const { monthlySpendData } = await getListOfYearsTransactionTotalsByMonth(userId)
        const spendsExist = monthlySpendData.some(item => item.value !== 0)
        if (spendsExist) {
            const { yearOfCategorySpend, results } = await getYearOfCategorySpend(userId, months)
            yearOfCategorySpend.map(async (monthOfCategorySpend) => (
                await createMonthlySpendAction({ month: monthOfCategorySpend.month, monthTotal: monthOfCategorySpend.monthTotal, monthCategoryTotals: monthOfCategorySpend.categoryData, userId, path: "/" })
            ))
        } else {
            console.log("No transactions currently exist")
        }
    }

    if (monthlyIncomesResults) {
        console.log(monthlyIncomesResults)
        console.log("Incomes found!")
    } else {
        console.log("No incomes found :(")
    }

    //_______________________________________________________________________________________________________________________________________
    //_______________________________________________________________________________________________________________________________________
    // _______________________________________________________________________________________________________________________________________

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            <h1 className="text-xl font-bold mb-4">Income vs Expenses</h1>
            <YearlyIncomeVsSpendingGroupChart monthSpendData={monthlySpendData} monthIncomeData={monthlyIncomeData} />

            <h1 className="text-xl font-bold mb-4">Category Spending Per Month</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3">
                {results === 0 ? (
                    <p>No data found</p>
                ) : (
                    yearOfCategorySpend.map((monthOfCategorySpend) => (
                        <MonthSpendingCategorySplit categoryData={monthOfCategorySpend.categoryData} month={monthOfCategorySpend.month} monthTotal={monthOfCategorySpend.monthTotal} />
                    ))
                )}
            </div>

            <h1 className="text-xl font-bold mb-4">Category Income Per Month</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3">
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