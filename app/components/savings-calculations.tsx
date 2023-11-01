import { getOldestOrNewestTransaction, getTransactionsBetweenDates } from "../lib/transaction-db"
import { IncomeFilter, getIncomesBetweenDates, getOldestOrNewestIncome } from "../lib/income-db"
import { TransactionFilter } from "../lib/transaction-db"
import { calculateDifference, calculateIncomeTotal, calculateTransactionTotal } from "./target-calculation-functions"
import { IncomeClass } from "../models/Income";
import { TransactionClass } from "../models/Transaction";

interface transactionIncomeTotal {
    month: Date;
    value: number;
    transaction: boolean;
}

interface savingsObject {
    date: Date;
    value: number;
}

export async function calculateInitialSavings(userId: string) {
    let transactionFilter: TransactionFilter = {
        userId: userId,
    }

    let incomeFilter: IncomeFilter = {
        userId: userId,
    }

    let monthlyTotals: transactionIncomeTotal[] = [];

    const { oldestTransaction, oldestTransactionFound, newestTransaction, newestTransactionFound } = await getOldestAndNewestTransactions(transactionFilter)
    const oldestTransactionDate = oldestTransaction?.transactionDate ?? new Date;
    const newestTransactionDate = newestTransaction?.transactionDate ?? new Date;
    const { oldestIncome, oldestIncomeFound, newestIncome, newestIncomeFound } = await getOldestAndNewestIncomes(incomeFilter)
    const oldestIncomeDate = oldestIncome?.incomeDate ?? new Date;
    const newestIncomeDate = newestIncome?.incomeDate ?? new Date;

    if (!oldestTransactionFound || !newestTransactionFound) {
        // Process if there are no transactions
        console.log(oldestTransactionFound);
        console.log(newestTransactionFound);
    } else {
        // Process if there are transactions
        // Produce an array of months between the oldest and newest transactions
        // And get all transactions between the oldest and the newest dates
        let transactionMonths = getMonthsBetweenDates(oldestTransactionDate, newestTransactionDate);
        let { transactions } = await getTransactionsBetweenDates(transactionFilter, oldestTransactionDate, newestTransactionDate);

        // Iterate through each of the months and calculate the total transactions in each of them
        // Then add the totals to an array of objects for a later transaction
        transactionMonths.forEach((startDate) => {
            if (transactions) {
                let monthTransactionTotal = calculateMonthsTransactions(startDate, transactions);
                monthlyTotals.push(monthTransactionTotal);
            }
        })
    }

    if (!oldestIncomeFound || !newestIncomeFound) {
        // Process if there are no incomes
        console.log(oldestIncomeFound)
        console.log(newestIncomeFound)
    } else {
        // Process if there are incomes
        // Produce an array of months between the oldest and newest incomes
        // And get all incomes between the oldest and the newest dates
        let incomeMonths = getMonthsBetweenDates(oldestIncomeDate, newestIncomeDate);
        let { incomes } = await getIncomesBetweenDates(incomeFilter, oldestIncomeDate, newestIncomeDate);

        // Iterate through each of the months and calculate the total incomes in each of them
        // Then add the totals to an array of objects for a later incomes
        incomeMonths.forEach((startDate) => {
            if (incomes) {
                let monthIncomesTotal = calculateMonthsIncomes(startDate, incomes);
                monthlyTotals.push(monthIncomesTotal);
            }
        })
    }

    const initialSavings = calculateMonthlySavings(monthlyTotals)

    return initialSavings;

}

export function createSavings(savings: savingsObject[], userId: string){
    savings.forEach((saving) => {
        console.log(saving)
    })
}

function calculateMonthsTransactions(startDate: Date, transactions: TransactionClass[]) {
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    let monthTransactions: TransactionClass[] = [];

    if (transactions) {
        for (const transaction of transactions) {
            const transactionDate = transaction.transactionDate;
            if (transactionDate >= startDate && transactionDate <= endDate) {
                monthTransactions.push(transaction)
            }
        }
    }

    let transactionTotal = calculateTransactionTotal(monthTransactions)
    let monthTransactionTotal: transactionIncomeTotal = {
        month: startDate,
        value: transactionTotal,
        transaction: true,
    }

    return monthTransactionTotal;
}

function calculateMonthsIncomes(startDate: Date, incomes: IncomeClass[]) {
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    let monthIncomes: IncomeClass[] = [];

    if (incomes) {
        for (const income of incomes) {
            const incomeDate = income.incomeDate;
            if (incomeDate >= startDate && incomeDate <= endDate) {
                monthIncomes.push(income)
            }
        }
    }

    let incomeTotal = calculateIncomeTotal(monthIncomes)
    let monthIncomeTotal: transactionIncomeTotal = {
        month: startDate,
        value: incomeTotal,
        transaction: false,
    }
    return monthIncomeTotal;
}

function calculateMonthlySavings(monthlyTotals: transactionIncomeTotal[]) {
    const monthlySavings: savingsObject[] = [];

    const sortedTotals = monthlyTotals.sort((a, b) => (a.month < b.month ? -1 : 1));
    const newestDate = sortedTotals[sortedTotals.length - 1].month
    const oldestDate = sortedTotals[0].month

    const allMonths = getMonthsBetweenDates(oldestDate, newestDate)

    for (const month of allMonths) {
        const monthTotals = getMonthTotalItems(month, monthlyTotals);
        const monthTransaction = monthTotals.find((monthTotal) => monthTotal.transaction == true)?.value;
        const monthIncome = monthTotals.find((monthTotal) => monthTotal.transaction == false)?.value;

        const monthSaving: savingsObject = {
            date: month,
            value: calculateDifference(monthTransaction ?? 0, monthIncome ?? 0)
        }
        monthlySavings.push(monthSaving);
    }

    return monthlySavings;

}

async function getOldestAndNewestTransactions(filter: TransactionFilter) {
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
    const months = [];

    for (let i = startDate.getMonth(); i <= endDate.getMonth(); i++) {
        months.push(new Date(startDate.getFullYear(), i, 1))
    }

    return months;
}

function getMonthTotalItems(month: Date, monthlyTotals: transactionIncomeTotal[]) {
    const monthTotal = monthlyTotals.filter(function (monthlyTotal) {
        return monthlyTotal.month.getTime() === month.getTime();
    })

    return monthTotal;
}