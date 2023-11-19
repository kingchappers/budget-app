import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import { getLastTwelveMonths } from "../lib/utils";
import { calculateTransactionTotal } from "./target-calculation-functions";
import { monthSpendData } from "./trend-graphs";

export async function getListOfYearsTransactionsByMonth(userId: string) {
    // type spendData= [{
    //     month: string,
    //     monthSpend: number
    // }]

    var yearSpendData: {
        month: string;
        monthSpend: number;
    }[] = []

    const lastTwelveMonths = getLastTwelveMonths()

    const monthPromises = lastTwelveMonths.map(async (month) => {
        const startDate = month
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)



        const { transactions } = await getTransactionsBetweenDatesAction({ userId, startDate, endDate })
        const monthTotal = calculateTransactionTotal(transactions)
        const monthAsString = month.toLocaleString('default', { month: 'long' })
        yearSpendData.push({ month: monthAsString, monthSpend: monthTotal })
        // console.log(yearSpendData)
    })

    await Promise.all(monthPromises);

    // console.log(yearSpendData)

    return { yearSpendData };
}


