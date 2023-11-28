import { getIncomesBetweenDatesAction } from "../_incomeActions";
import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import { getLastTwelveMonths } from "../lib/utils";
import { calculateIncomeTotal, calculateTransactionTotal } from "./target-calculation-functions";
import { monthData } from "./trend-graphs";

export interface categorySpendData {
    category: string,
    categorySpend: number,
}

export async function getListOfYearsTransactionTotalsByMonth(userId: string) {
    var monthlySpendData: monthData[] = [];
    const lastTwelveMonths = getLastTwelveMonths();

    const monthPromises = lastTwelveMonths.map(async (month) => {
        const startDate = month;
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const { transactions } = await getTransactionsBetweenDatesAction({ userId, startDate, endDate });
        const monthTotal = calculateTransactionTotal(transactions);
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3);
        monthlySpendData.push({ month: monthAsString, value: monthTotal });
    })

    await Promise.all(monthPromises);

    return { monthlySpendData };
}

export async function getListOfYearsIncomeTotalsByMonth(userId: string) {
    var monthlyIncomeData: monthData[] = [];
    const lastTwelveMonths = getLastTwelveMonths();

    const monthPromises = lastTwelveMonths.map(async (month) => {
        const startDate = month;
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const { incomes } = await getIncomesBetweenDatesAction({ userId, startDate, endDate });
        const monthTotal = calculateIncomeTotal(incomes);
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3);
        monthlyIncomeData.push({ month: monthAsString, value: monthTotal });
    })

    await Promise.all(monthPromises);

    return { monthlyIncomeData };
}

export function twelveMonthsInOrder() {
    const lastTwelveMonths = getLastTwelveMonths()
    var dateOrder: string[] = [];
    const monthPromises = lastTwelveMonths.map((month) => {
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
        dateOrder.push(monthAsString);
    })
    return dateOrder;
}

export async function getCategoryTransactionTotalBetweenDates(userId: string, startDate: Date, endDate: Date) {
    const categorySpendRecord: Record<string, number> = {}
    const { transactions } = await getTransactionsBetweenDatesAction({ userId, startDate, endDate })

    if (transactions) {
        for (const transaction of transactions) {
            const category = transaction.category;
            const value = transaction.value;
            if (!categorySpendRecord[category]) {
                categorySpendRecord[category] = 0;
            }
            categorySpendRecord[category] += value
        }
    }

    const categorySpendData: categorySpendData[] = Object.entries(categorySpendRecord).map(([category, value]) => ({
        category: category,
        categorySpend: value
    }))

    const monthTotal = calculateTransactionTotal(transactions)

    return { categorySpendData, monthTotal };
}

