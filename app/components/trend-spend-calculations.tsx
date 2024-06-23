import startOfMonth from "date-fns/startOfMonth";
import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import {  stringToDateInputFormat } from "../lib/utils";
import { monthSpendTotal } from "../models/MonthlySpend";
import { calculateTransactionTotal } from "./target-calculation-functions";
import { categorySplitPieProps } from "./trend-graphs";
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
            monthSpendTotals: monthSpendTotal[]
        }

        var newMonthCategoryTotal: monthSpendTotal;
        monthlySpend.monthTotal = monthlySpend.monthTotal + transactionValue;

        if (monthlySpend.monthSpendTotals.some((monthSpendTotal) => monthSpendTotal.spendType === transactionCategory)) {
            // If the category exists in the trends table update it
            const monthCategoryMatch = monthlySpend.monthSpendTotals.findIndex((monthSpendTotal) => monthSpendTotal.spendType === transactionCategory);

            monthlySpend.monthSpendTotals[monthCategoryMatch].value = monthlySpend.monthSpendTotals[monthCategoryMatch].value + transactionValue;
            monthlySpend.monthSpendTotals[monthCategoryMatch].percentage = (monthlySpend.monthSpendTotals[monthCategoryMatch].value / monthlySpend.monthTotal) * 100;
            monthlySpend.monthSpendTotals[monthCategoryMatch].chartTitle = monthlySpend.monthSpendTotals[monthCategoryMatch].spendType + `:\n£${monthlySpend.monthSpendTotals[monthCategoryMatch].value.toFixed(2)} | ${(monthlySpend.monthSpendTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            // Logic for creating a new entry for monthlyCategoryTotals if the category doesn't already exist
            newMonthCategoryTotal = {
                percentage: (transactionValue / monthlySpend.monthTotal) * 100,
                chartTitle: transactionCategory + `:\n£${transactionValue.toFixed(2)} | ${((transactionValue / monthlySpend.monthTotal) * 100).toFixed(2)}%`,
                spendType: transactionCategory,
                value: transactionValue
            }
            monthlySpend.monthSpendTotals.push(newMonthCategoryTotal)
        }

        monthlySpend.monthSpendTotals.forEach((monthSpendTotal) => {
            monthSpendTotal.percentage = (monthSpendTotal.value / monthlySpend.monthTotal) * 100;
            monthSpendTotal.chartTitle = monthSpendTotal.spendType + `:\n£${monthSpendTotal.value.toFixed(2)} | ${(monthSpendTotal.percentage).toFixed(2)}%`;
        })

        monthlySpendUpdate = {
            monthTotal: monthlySpend.monthTotal,
            monthSpendTotals: monthlySpend.monthSpendTotals
        }

        await updateMonthlySpendAction(monthlySpend.id, monthlySpendUpdate, "/")
    } else {
        let monthSpendTotals: monthSpendTotal[] = [];
        let monthSpendTotal: monthSpendTotal;
        newMonthCategoryTotal = {
            percentage: 100,
            chartTitle: transactionCategory + `:\n£${transactionValue.toFixed(2)} | 100%`,
            spendType: transactionCategory,
            value: transactionValue
        }
        monthSpendTotals.push(newMonthCategoryTotal)
        await createMonthlySpendAction({ month: transactionDateMonthStart, monthTotal: transactionValue, monthSpendTotals, path: "/", userId })
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
            monthSpendTotals: monthSpendTotal[]
        }

        monthlySpend.monthTotal = monthlySpend.monthTotal - deletedTransactionValue;

        // If the category exists in the trends table update it
        // If not print an error message
        const monthCategoryMatch = monthlySpend.monthSpendTotals.findIndex((monthSpendTotal) => monthSpendTotal.spendType === deletedTransactionCategory);
        if (monthCategoryMatch >= 0) {
            monthlySpend.monthSpendTotals[monthCategoryMatch].value = monthlySpend.monthSpendTotals[monthCategoryMatch].value - deletedTransactionValue;
            monthlySpend.monthSpendTotals[monthCategoryMatch].percentage = (monthlySpend.monthSpendTotals[monthCategoryMatch].value / monthlySpend.monthTotal) * 100;
            monthlySpend.monthSpendTotals[monthCategoryMatch].chartTitle = monthlySpend.monthSpendTotals[monthCategoryMatch].spendType + `:\n£${monthlySpend.monthSpendTotals[monthCategoryMatch].value.toFixed(2)} | ${(monthlySpend.monthSpendTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            console.log("The category wasn't found")
        }

        // Recalculate the percentages for each of the items
        monthlySpend.monthSpendTotals.forEach((monthSpendTotal) => {
            monthSpendTotal.percentage = (monthSpendTotal.value / monthlySpend.monthTotal) * 100;
            monthSpendTotal.chartTitle = monthSpendTotal.spendType + `:\n£${monthSpendTotal.value.toFixed(2)} | ${(monthSpendTotal.percentage).toFixed(2)}%`;
        })

        monthlySpendUpdate = {
            monthTotal: monthlySpend.monthTotal,
            monthSpendTotals: monthlySpend.monthSpendTotals
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

// export async function getListOfYearsTransactionTotalsByMonth(userId: string) {
//     var monthlySpendData: monthData[] = [];
//     const lastTwelveMonths = getLastTwelveMonths();

//     const monthPromises = lastTwelveMonths.map(async (month) => {
//         const startDate = month;
//         const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
//         const { transactions } = await getTransactionsBetweenDatesAction({ userId, startDate, endDate });
//         const monthTotal = calculateTransactionTotal(transactions);
//         const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3);
//         monthlySpendData.push({ month: monthAsString, value: monthTotal });
//     })

//     await Promise.all(monthPromises);

//     return { monthlySpendData };
// }

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

// async function getTypeTransactionTotalBetweenDates(userId: string, startDate: Date, endDate: Date) {
//     const categorySpendRecord: Record<string, number> = {};
//     const { transactions } = await getTransactionsBetweenDatesAction({ userId, startDate, endDate });
//     const monthTotal = calculateTransactionTotal(transactions);

//     if (transactions) {
//         for (const transaction of transactions) {
//             var category = transaction.category;
//             const value = transaction.value;
//             if (!categorySpendRecord[category]) {
//                 categorySpendRecord[category] = 0;
//             }
//             categorySpendRecord[category] += value;
//         }
//     }

//     const categorySpendData: monthSpendTotal[] = Object.entries(categorySpendRecord).map(([category, value]) => ({
//         chartTitle: category + `:\n£${value.toFixed(2)} | ${((value / monthTotal) * 100).toFixed(2)}%`,
//         spendType: category,
//         value: value,
//         percentage: ((value / monthTotal) * 100),
//     }))

//     return { categorySpendData, monthTotal };
// }

// // ______________________________________________________________________________________________________________________________________________________________________
// // ______________________________________________________________________________________________________________________________________________________________________
// // ______________________________________________________________________________________________________________________________________________________________________

// export async function getYearOfTypeSpend(userId: string, months: Date[]) {
//     var yearOfCategorySpend: categorySplitPieProps[] = [];
//     const monthPromises = months.map(async (month) => {
//         const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
//         const { categorySpendData, monthTotal } = await getTypeTransactionTotalBetweenDates(userId, month, endDate);
//         yearOfCategorySpend.push({ monthCategoryTotal: categorySpendData, month, monthTotal });
//     })
//     await Promise.all(monthPromises);
//     const results = yearOfCategorySpend.length;

//     yearOfCategorySpend.sort((a, b) => {
//         return b.month.getTime() - a.month.getTime();
//     })

//     return { yearOfCategorySpend, results };
// }

