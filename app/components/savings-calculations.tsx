import { getOldestOrNewestTransaction } from "../lib/transaction-db"
import { IncomeFilter, getOldestOrNewestIncome } from "../lib/income-db"
import { TransactionFilter } from "../lib/transaction-db"

export async function getOldestAndNewestTransactions(filter: TransactionFilter) {
    const { transaction: oldestTransaction, transactionFound: oldestTransactionFound } = await getOldestOrNewestTransaction(filter, true);
    const { transaction: newestTransaction, transactionFound: newestTransactionFound } = await getOldestOrNewestTransaction(filter, false);

    return {
        oldestTransaction,
        oldestTransactionFound,
        newestTransaction,
        newestTransactionFound
    }
}

export async function getOldestAndNewestIncomes(filter: IncomeFilter) {
    const { income: oldestIncome, incomeFound: oldestIncomeFound } = await getOldestOrNewestIncome(filter, true);
    const { income: newestIncome, incomeFound: newestIncomeFound } = await getOldestOrNewestIncome(filter, false);

    return {
        oldestIncome,
        oldestIncomeFound,
        newestIncome,
        newestIncomeFound
    }
}

export function getMonthsBetweenDates(startDate: Date, endDate: Date) {
    // const startMonth = startDate.getMonth();
    // const startYear = startDate.getFullYear();

    // const endMonth = endDate.getMonth();
    // const endYear = endDate.getFullYear();

    // const numberOfMonthsInStartYear = 12 - startMonth + 1;
    // const numberOfMonthsInEndYear = endMonth;

    // const numberOfMonthsBetweenYears = (endYear - startYear - 1) * 12;

    // const totalNumberOfMonths = numberOfMonthsInStartYear + numberOfMonthsInEndYear + numberOfMonthsBetweenYears;

    // return totalNumberOfMonths;

    const months = [];

    for (let i = startDate.getMonth(); i <= endDate.getMonth(); i++) {
        months.push(i)
    }
}