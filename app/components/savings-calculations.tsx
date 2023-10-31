import { getOldestOrNewestTransaction, getTransactionsBetweenDates } from "../lib/transaction-db"
import { IncomeFilter, getIncomesBetweenDates, getOldestOrNewestIncome } from "../lib/income-db"
import { TransactionFilter } from "../lib/transaction-db"
import { calculateIncomeTotal, calculateTransactionTotal } from "./target-calculation-functions"

export async function calculateInitialSavings(userId: string) {
    let transactionFilter: TransactionFilter = {
        userId: userId,
    }

    let incomeFilter: IncomeFilter = {
        userId: userId,
    }
    const { oldestTransaction, oldestTransactionFound, newestTransaction, newestTransactionFound } = await getOldestAndNewestTransactions(transactionFilter)
        const { oldestIncome, oldestIncomeFound, newestIncome, newestIncomeFound } = await getOldestAndNewestIncomes(incomeFilter)

        const oldestTransactionDate = oldestTransaction?.transactionDate ?? new Date;
        const newestTransactionDate = newestTransaction?.transactionDate ?? new Date;

        const oldestIncomeDate = oldestIncome?.incomeDate ?? new Date;
        const newestIncomeDate = newestIncome?.incomeDate ?? new Date;

        if (!oldestTransactionFound || !newestTransactionFound) {
            // Process if there are no transactions
            console.log(oldestTransactionFound)
            console.log(newestTransactionFound)
        } else {
            var transactionMonths = getMonthsBetweenDates(oldestTransactionDate, newestTransactionDate)
            transactionMonths.forEach(async (startDate) => {
                console.log(startDate)
                const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                console.log(endDate)

                let  { transactions } = await getTransactionsBetweenDates(transactionFilter, startDate, endDate)
                let transactionTotal = calculateTransactionTotal(transactions)
                console.log("Total transactions for " + startDate + ": " + transactionTotal)
            })
        }

        if (!oldestIncomeFound || !newestIncomeFound) {
            // Process if there are no incomes
            console.log(oldestIncomeFound)
            console.log(newestIncomeFound)
        } else {
            var incomeMonths = getMonthsBetweenDates(oldestIncomeDate, newestIncomeDate)
            incomeMonths.forEach(async (startDate) => {
                console.log(startDate)
                const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                console.log(endDate)

                let  { incomes } = await getIncomesBetweenDates(incomeFilter, startDate, endDate)
                let incomeTotal = calculateIncomeTotal(incomes)
                console.log("Total income for" + startDate + ": " + incomeTotal)
            })
        }
}

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
        months.push(new Date(startDate.getFullYear(), i, 1))
    }

    return months;
}