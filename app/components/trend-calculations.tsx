import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import { getLastTwelveMonths } from "../lib/utils";
import { calculateTransactionTotal } from "./target-calculation-functions";
import { monthSpendData } from "./trend-graphs";

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

    // monthlySpendData[0].month = monthlySpendData[0].month + " " + lastTwelveMonths[0].getFullYear().toString().substring(2)
    // console.log(lastTwelveMonths[0].getFullYear().toString().substring(2))

    return { monthlySpendData };
}


