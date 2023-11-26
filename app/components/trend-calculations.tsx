import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import { getIncomesBetweenDates } from "../lib/income-db";
import { getLastTwelveMonths } from "../lib/utils";
import { calculateIncomeTotal, calculateTransactionTotal } from "./target-calculation-functions";
import { monthIncomeData, monthSpendData } from "./trend-graphs";

export async function getListOfYearsTransactionsByMonth(userId: string) {

    var monthlySpendData: monthSpendData[] = []

    const lastTwelveMonths = getLastTwelveMonths()

    const monthPromises = lastTwelveMonths.map(async (month) => {
        const startDate = month
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

        const { transactions } = await getTransactionsBetweenDatesAction({ userId, startDate, endDate })
        const monthTotal = calculateTransactionTotal(transactions)
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
        monthlySpendData.push({ month: monthAsString, monthSpend: monthTotal })
    })

    await Promise.all(monthPromises);

    return { monthlySpendData };
}

export async function getListOfYearsIncomesByMonth(userId: string) {

    var monthlyIncomeData: monthIncomeData[] = []
    const lastTwelveMonths = getLastTwelveMonths()

    const incomeFilter = {
        userId: userId
    }

    const monthPromises = lastTwelveMonths.map(async (month) => {
        const startDate = month
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
        const { incomes } = await getIncomesBetweenDates(incomeFilter, startDate, endDate)
        const monthTotal = calculateIncomeTotal(incomes)
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
        monthlyIncomeData.push({ month: monthAsString, monthIncome: monthTotal })
    })

    await Promise.all(monthPromises);

    return { monthlyIncomeData };
}

export function twelveMonthsInOrder(){
    const lastTwelveMonths = getLastTwelveMonths()
    var dateOrder: string[] = []
    const monthPromises = lastTwelveMonths.map((month) => {
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
        dateOrder.push(monthAsString)
    })

    return dateOrder;
}