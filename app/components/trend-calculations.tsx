import startOfMonth from "date-fns/startOfMonth";
import { getIncomesBetweenDatesAction } from "../_incomeActions";
import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import { getLastTwelveMonths, stringToDate } from "../lib/utils";
import { monthCategoryTotal } from "../models/MonthlySpend";
import { calculateIncomeTotal, calculateTransactionTotal } from "./target-calculation-functions";
import { categorySplitPieProps, monthData } from "./trend-graphs";
import { createMonthlySpendAction, getMonthlySpendByMonthAction, updateMonthlySpendAction } from "../_monthlySpendActions";

//_______________________________________________________________________________________________________________________________________
// New Functions below
//_______________________________________________________________________________________________________________________________________

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlySpendUpdateForNewTransactions(transactionValue: number, transactionCategory: string, transactionDate: string, userId: string) {
    const transactionDateMonthStart = startOfMonth(stringToDate(transactionDate))
    const { monthlySpend } = await getMonthlySpendByMonthAction({ month: transactionDateMonthStart, userId });

    if (monthlySpend) {
        var monthlySpendUpdate: {
            monthTotal: number,
            monthCategoryTotals: monthCategoryTotal[]
        }

        var newMonthCategoryTotal: monthCategoryTotal;
        monthlySpend.monthTotal = monthlySpend.monthTotal + transactionValue;

        if (monthlySpend.monthCategoryTotals.some((monthCategoryTotal) => monthCategoryTotal.categoryName === transactionCategory)) {
            // If the category exists in the trends table update it
            const monthCategoryMatch = monthlySpend.monthCategoryTotals.findIndex((monthCategoryTotal) => monthCategoryTotal.categoryName === transactionCategory)

            monthlySpend.monthCategoryTotals[monthCategoryMatch].value = monthlySpend.monthCategoryTotals[monthCategoryMatch].value + transactionValue;
            monthlySpend.monthCategoryTotals[monthCategoryMatch].percentage = (monthlySpend.monthCategoryTotals[monthCategoryMatch].value / monthlySpend.monthTotal) * 100;
            monthlySpend.monthCategoryTotals[monthCategoryMatch].chartTitle = monthlySpend.monthCategoryTotals[monthCategoryMatch].categoryName + `:\n£${monthlySpend.monthCategoryTotals[monthCategoryMatch].value} | ${(monthlySpend.monthCategoryTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            // Logic for creating a new entry for monthlyCategoryTotals if the category doesn't already exist
            newMonthCategoryTotal = {
                percentage: (transactionValue / monthlySpend.monthTotal) * 100,
                chartTitle: transactionCategory + `:\n£${transactionValue} | ${((transactionValue / monthlySpend.monthTotal) * 100).toFixed(2)}%`,
                categoryName: transactionCategory,
                value: transactionValue
            }
            monthlySpend.monthCategoryTotals.push(newMonthCategoryTotal)
        }

        monthlySpend.monthCategoryTotals.forEach((monthCategoryTotal) => {
            monthCategoryTotal.percentage = (monthCategoryTotal.value / monthlySpend.monthTotal) * 100;
            monthCategoryTotal.chartTitle = monthCategoryTotal.categoryName + `:\n£${monthCategoryTotal.value} | ${(monthCategoryTotal.percentage).toFixed(2)}%`;
        })

        monthlySpendUpdate = {
            monthTotal: monthlySpend.monthTotal,
            monthCategoryTotals: monthlySpend.monthCategoryTotals
        }

        await updateMonthlySpendAction(monthlySpend.id, monthlySpendUpdate, "/")
    } else {
        let monthCategoryTotals: monthCategoryTotal[] = [];
        let newMonthCategoryTotal: monthCategoryTotal;
        newMonthCategoryTotal = {
            percentage: 100,
            chartTitle: transactionCategory + `:\n£${transactionValue} | 100%`,
            categoryName: transactionCategory,
            value: transactionValue
        }
        monthCategoryTotals.push(newMonthCategoryTotal)
        await createMonthlySpendAction({ month: transactionDateMonthStart, monthTotal: transactionValue, monthCategoryTotals, path: "/", userId})
    }
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

//_______________________________________________________________________________________________________________________________________
// New Functions above
//_______________________________________________________________________________________________________________________________________

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

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

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

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export function twelveMonthsInOrder() {
    const lastTwelveMonths = getLastTwelveMonths()
    var dateOrder: string[] = [];
    const monthPromises = lastTwelveMonths.map((month) => {
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
        dateOrder.push(monthAsString);
    })
    return dateOrder;
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

async function getCategoryTransactionTotalBetweenDates(userId: string, startDate: Date, endDate: Date) {
    const categorySpendRecord: Record<string, number> = {};
    const { transactions } = await getTransactionsBetweenDatesAction({ userId, startDate, endDate });
    const monthTotal = calculateTransactionTotal(transactions);

    if (transactions) {
        for (const transaction of transactions) {
            var category = transaction.category;
            const value = transaction.value;
            if (!categorySpendRecord[category]) {
                categorySpendRecord[category] = 0;
            }
            categorySpendRecord[category] += value;
        }
    }

    const categorySpendData: monthCategoryTotal[] = Object.entries(categorySpendRecord).map(([category, value]) => ({
        chartTitle: category + `:\n£${value} | ${((value / monthTotal) * 100).toFixed(2)}%`,
        categoryName: category,
        value: value,
        percentage: ((value / monthTotal) * 100),
    }))

    return { categorySpendData, monthTotal };
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

async function getCategoryIncomeTotalBetweenDates(userId: string, startDate: Date, endDate: Date) {
    const categoryIncomeRecord: Record<string, number> = {};
    const { incomes } = await getIncomesBetweenDatesAction({ userId, startDate, endDate });
    const monthTotal = calculateIncomeTotal(incomes);

    if (incomes) {
        for (const income of incomes) {
            var incomeCategory = income.incomeCategory;
            const value = income.amount;
            if (!categoryIncomeRecord[incomeCategory]) {
                categoryIncomeRecord[incomeCategory] = 0;
            }
            categoryIncomeRecord[incomeCategory] += value;
        }
    }

    const categoryIncomeData: monthCategoryTotal[] = Object.entries(categoryIncomeRecord).map(([incomeCategory, value]) => ({
        chartTitle: incomeCategory + `:\n£${value} | ${((value / monthTotal) * 100).toFixed(2)}%`,
        categoryName: incomeCategory,
        value: value,
        percentage: ((value / monthTotal) * 100),
    }))

    return { categoryIncomeData, monthTotal }
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function getYearOfCategorySpend(userId: string, months: Date[]) {
    var yearOfCategorySpend: categorySplitPieProps[] = [];
    const monthPromises = months.map(async (month) => {
        const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const { categorySpendData, monthTotal } = await getCategoryTransactionTotalBetweenDates(userId, month, endDate);
        yearOfCategorySpend.push({ monthCategoryTotal: categorySpendData, month, monthTotal });
    })
    await Promise.all(monthPromises);
    const results = yearOfCategorySpend.length;

    yearOfCategorySpend.sort((a, b) => {
        return b.month.getTime() - a.month.getTime();
    })

    return { yearOfCategorySpend, results };
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________________________________________________________

export async function getYearOfCategoryIncome(userId: string, months: Date[]) {
    var yearOfCategoryIncome: categorySplitPieProps[] = [];
    const monthPromises = months.map(async (month) => {
        const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const { categoryIncomeData, monthTotal } = await getCategoryIncomeTotalBetweenDates(userId, month, endDate);
        yearOfCategoryIncome.push({ monthCategoryTotal: categoryIncomeData, month, monthTotal });
    })
    await Promise.all(monthPromises);
    const results = yearOfCategoryIncome.length;

    yearOfCategoryIncome.sort((a, b) => {
        return b.month.getTime() - a.month.getTime();
    })

    return { yearOfCategoryIncome, results };
}