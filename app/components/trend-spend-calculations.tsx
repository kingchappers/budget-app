import startOfMonth from "date-fns/startOfMonth";
import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import { getLastTwelveMonths, stringToDateInputFormat } from "../lib/utils";
import { monthCategoryTotal } from "../models/MonthlySpend";
import { calculateTransactionTotal } from "./target-calculation-functions";
import { categorySplitPieProps, monthData } from "./trend-graphs";
import { createMonthlySpendAction, getMonthlySpendByMonthAction, updateMonthlySpendAction } from "../_monthlySpendActions";

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlySpendUpdateForNewTransactions(transactionValue: number, transactionCategory: string, transactionDate: string, userId: string) {
    const transactionDateMonthStart = startOfMonth(stringToDateInputFormat(transactionDate))
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
            const monthCategoryMatch = monthlySpend.monthCategoryTotals.findIndex((monthCategoryTotal) => monthCategoryTotal.categoryName === transactionCategory);

            monthlySpend.monthCategoryTotals[monthCategoryMatch].value = monthlySpend.monthCategoryTotals[monthCategoryMatch].value + transactionValue;
            monthlySpend.monthCategoryTotals[monthCategoryMatch].percentage = (monthlySpend.monthCategoryTotals[monthCategoryMatch].value / monthlySpend.monthTotal) * 100;
            monthlySpend.monthCategoryTotals[monthCategoryMatch].chartTitle = monthlySpend.monthCategoryTotals[monthCategoryMatch].categoryName + `:\n£${monthlySpend.monthCategoryTotals[monthCategoryMatch].value.toFixed(2)} | ${(monthlySpend.monthCategoryTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            // Logic for creating a new entry for monthlyCategoryTotals if the category doesn't already exist
            newMonthCategoryTotal = {
                percentage: (transactionValue / monthlySpend.monthTotal) * 100,
                chartTitle: transactionCategory + `:\n£${transactionValue.toFixed(2)} | ${((transactionValue / monthlySpend.monthTotal) * 100).toFixed(2)}%`,
                categoryName: transactionCategory,
                value: transactionValue
            }
            monthlySpend.monthCategoryTotals.push(newMonthCategoryTotal)
        }

        monthlySpend.monthCategoryTotals.forEach((monthCategoryTotal) => {
            monthCategoryTotal.percentage = (monthCategoryTotal.value / monthlySpend.monthTotal) * 100;
            monthCategoryTotal.chartTitle = monthCategoryTotal.categoryName + `:\n£${monthCategoryTotal.value.toFixed(2)} | ${(monthCategoryTotal.percentage).toFixed(2)}%`;
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
            chartTitle: transactionCategory + `:\n£${transactionValue.toFixed(2)} | 100%`,
            categoryName: transactionCategory,
            value: transactionValue
        }
        monthCategoryTotals.push(newMonthCategoryTotal)
        await createMonthlySpendAction({ month: transactionDateMonthStart, monthTotal: transactionValue, monthCategoryTotals, path: "/", userId })
    }
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlySpendUpdateForEditedTransactions(oldTransactionValue: number, oldTransactionCategory: string, oldTransactionDate: Date, updatedTransactionValue: number, updatedTransactionCategory: string, updatedTransactionDate: string, userId: string) {
    //Calculate and remove the old calculation from trendSpend table
    try{
        await calulateMonthlySpendUpdateForDeletedTransactions(oldTransactionValue, oldTransactionCategory, oldTransactionDate, userId)
        console.log("success")
    } catch(e){
        console.error(e)
    }

    // Add the updated values as though they were a new transaction
    try{
        await calulateMonthlySpendUpdateForNewTransactions(updatedTransactionValue, updatedTransactionCategory, updatedTransactionDate, userId);
        console.log("success")
    } catch(e){
        console.error(e)
    }
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlySpendUpdateForDeletedTransactions(deletedTransactionValue: number, deletedTransactionCategory: string, deletedTransactionDate: Date, userId: string) {
    // Find and remove the edited transaction value from the trendsSpend table
    const oldTransactionDateMonthStart = startOfMonth(deletedTransactionDate)
    const { monthlySpend } = await getMonthlySpendByMonthAction({ month: oldTransactionDateMonthStart, userId });

    if (monthlySpend) {
        var monthlySpendUpdate: {
            monthTotal: number,
            monthCategoryTotals: monthCategoryTotal[]
        }

        monthlySpend.monthTotal = monthlySpend.monthTotal - deletedTransactionValue;

        // If the category exists in the trends table update it
        // If not print an error message
        const monthCategoryMatch = monthlySpend.monthCategoryTotals.findIndex((monthCategoryTotal) => monthCategoryTotal.categoryName === deletedTransactionCategory);
        if (monthCategoryMatch >= 0) {
            monthlySpend.monthCategoryTotals[monthCategoryMatch].value = monthlySpend.monthCategoryTotals[monthCategoryMatch].value - deletedTransactionValue;
            monthlySpend.monthCategoryTotals[monthCategoryMatch].percentage = (monthlySpend.monthCategoryTotals[monthCategoryMatch].value / monthlySpend.monthTotal) * 100;
            monthlySpend.monthCategoryTotals[monthCategoryMatch].chartTitle = monthlySpend.monthCategoryTotals[monthCategoryMatch].categoryName + `:\n£${monthlySpend.monthCategoryTotals[monthCategoryMatch].value.toFixed(2)} | ${(monthlySpend.monthCategoryTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            console.log("The category wasn't found")
        }

        // Recalculate the percentages for each of the items
        monthlySpend.monthCategoryTotals.forEach((monthCategoryTotal) => {
            monthCategoryTotal.percentage = (monthCategoryTotal.value / monthlySpend.monthTotal) * 100;
            monthCategoryTotal.chartTitle = monthCategoryTotal.categoryName + `:\n£${monthCategoryTotal.value.toFixed(2)} | ${(monthCategoryTotal.percentage).toFixed(2)}%`;
        })

        monthlySpendUpdate = {
            monthTotal: monthlySpend.monthTotal,
            monthCategoryTotals: monthlySpend.monthCategoryTotals
        }

        await updateMonthlySpendAction(monthlySpend.id, monthlySpendUpdate, "/")
    } else {
        // Print an error if no spend could be found
        console.log("No spend was found for that month")
    }
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

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
        chartTitle: category + `:\n£${value.toFixed(2)} | ${((value / monthTotal) * 100).toFixed(2)}%`,
        categoryName: category,
        value: value,
        percentage: ((value / monthTotal) * 100),
    }))

    return { categorySpendData, monthTotal };
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

