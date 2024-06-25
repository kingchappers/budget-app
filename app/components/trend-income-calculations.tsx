import startOfMonth from "date-fns/startOfMonth";
import { getIncomesBetweenDatesAction } from "../_incomeActions";
import { stringToDateInputFormat } from "../lib/utils";
import { monthIncomeTotal } from "../models/MonthlyIncome";
import { calculateIncomeTotal } from "./target-calculation-functions";
import { categorySplitPieProps } from "./trend-graphs";
import { createMonthlyIncomeAction, getMonthlyIncomeByMonthAction, updateMonthlyIncomeAction } from "../_monthlyIncomeActions";

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlyIncomeUpdateForNewIncomes(incomeValue: number, incomeCategory: string, incomeDate: string, userId: string) {
    const incomeDateMonthStart = startOfMonth(stringToDateInputFormat(incomeDate))
    const { monthlyIncome } = await getMonthlyIncomeByMonthAction({ month: incomeDateMonthStart, userId });
    console.log("Monthly Income Total")

    if (monthlyIncome) {
        var monthlyIncomeUpdate: {
            monthTotal: number,
            monthIncomeTotals: monthIncomeTotal[]
        }

        var newMonthIncomeTotal: monthIncomeTotal;
        monthlyIncome.monthTotal = monthlyIncome.monthTotal + incomeValue;

        if (monthlyIncome.monthIncomeTotals.some((monthIncomeTotal) => monthIncomeTotal.incomeType === incomeCategory)) {
            // If the category exists in the trends table update it
            const monthCategoryMatch = monthlyIncome.monthIncomeTotals.findIndex((monthIncomeTotal) => monthIncomeTotal.incomeType === incomeCategory);

            monthlyIncome.monthIncomeTotals[monthCategoryMatch].value = monthlyIncome.monthIncomeTotals[monthCategoryMatch].value + incomeValue;
            monthlyIncome.monthIncomeTotals[monthCategoryMatch].percentage = (monthlyIncome.monthIncomeTotals[monthCategoryMatch].value / monthlyIncome.monthTotal) * 100;
            monthlyIncome.monthIncomeTotals[monthCategoryMatch].chartTitle = monthlyIncome.monthIncomeTotals[monthCategoryMatch].incomeType + `:\n£${monthlyIncome.monthIncomeTotals[monthCategoryMatch].value.toFixed(2)} | ${(monthlyIncome.monthIncomeTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            // Logic for creating a new entry for monthlyCategoryTotals if the category doesn't already exist
            newMonthIncomeTotal = {
                percentage: (incomeValue / monthlyIncome.monthTotal) * 100,
                chartTitle: incomeCategory + `:\n£${incomeValue.toFixed(2)} | ${((incomeValue / monthlyIncome.monthTotal) * 100).toFixed(2)}%`,
                incomeType: incomeCategory,
                value: incomeValue
            }
            monthlyIncome.monthIncomeTotals.push(newMonthIncomeTotal)
        }

        monthlyIncome.monthIncomeTotals.forEach((monthIncomeTotal) => {
            monthIncomeTotal.percentage = (monthIncomeTotal.value / monthlyIncome.monthTotal) * 100;
            monthIncomeTotal.chartTitle = monthIncomeTotal.incomeType + `:\n£${monthIncomeTotal.value.toFixed(2)} | ${(monthIncomeTotal.percentage).toFixed(2)}%`;
        })

        monthlyIncomeUpdate = {
            monthTotal: monthlyIncome.monthTotal,
            monthIncomeTotals: monthlyIncome.monthIncomeTotals
        }

        await updateMonthlyIncomeAction(monthlyIncome.id, monthlyIncomeUpdate, "/")
    } else {
        let monthIncomeTotals: monthIncomeTotal[] = [];
        let newMonthIncomeTotal: monthIncomeTotal;
        newMonthIncomeTotal = {
            percentage: 100,
            chartTitle: incomeCategory + `:\n£${incomeValue.toFixed(2)} | 100%`,
            incomeType: incomeCategory,
            value: incomeValue
        }
        monthIncomeTotals.push(newMonthIncomeTotal)
        await createMonthlyIncomeAction({ month: incomeDateMonthStart, monthTotal: incomeValue, monthIncomeTotals, path: "/", userId })
    }
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlyIncomeUpdateForEditedIncomes(oldIncomeValue: number, oldIncomeCategory: string, oldIncomeDate: Date, updatedIncomeValue: number, updatedIncomeCategory: string, updatedIncomeDate: string, userId: string) {
    //Calculate and remove the old calculation from trendIncome table
    await calulateMonthlyIncomeUpdateForDeletedIncomes(oldIncomeValue, oldIncomeCategory, oldIncomeDate, userId)

    // Add the updated values as though they were a new Income
    await calulateMonthlyIncomeUpdateForNewIncomes(updatedIncomeValue, updatedIncomeCategory, updatedIncomeDate, userId);
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlyIncomeUpdateForDeletedIncomes(deletedIncomeValue: number, deletedIncomeCategory: string, deletedIncomeDate: Date, userId: string) {
    // Find and remove the edited Income value from the trendsIncometable
    const oldIncomeDateMonthStart = startOfMonth(deletedIncomeDate)
    const { monthlyIncome } = await getMonthlyIncomeByMonthAction({ month: oldIncomeDateMonthStart, userId });

    if (monthlyIncome) {
        var monthlyIncomeUpdate: {
            monthTotal: number,
            monthIncomeTotals: monthIncomeTotal[]
        }

        monthlyIncome.monthTotal = monthlyIncome.monthTotal - deletedIncomeValue;

        // If the category exists in the trends table update it
        // If not print an error message
        const monthCategoryMatch = monthlyIncome.monthIncomeTotals.findIndex((monthIncomeTotal) => monthIncomeTotal.incomeType === deletedIncomeCategory);
        if (monthCategoryMatch >= 0) {
            monthlyIncome.monthIncomeTotals[monthCategoryMatch].value = monthlyIncome.monthIncomeTotals[monthCategoryMatch].value - deletedIncomeValue;
            monthlyIncome.monthIncomeTotals[monthCategoryMatch].percentage = (monthlyIncome.monthIncomeTotals[monthCategoryMatch].value / monthlyIncome.monthTotal) * 100;
            monthlyIncome.monthIncomeTotals[monthCategoryMatch].chartTitle = monthlyIncome.monthIncomeTotals[monthCategoryMatch].incomeType + `:\n£${monthlyIncome.monthIncomeTotals[monthCategoryMatch].value.toFixed(2)} | ${(monthlyIncome.monthIncomeTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            console.log("The category wasn't found")
        }

        // Recalculate the percentages for each of the items
        monthlyIncome.monthIncomeTotals.forEach((monthIncomeTotal) => {
            monthIncomeTotal.percentage = (monthIncomeTotal.value / monthlyIncome.monthTotal) * 100;
            monthIncomeTotal.chartTitle = monthIncomeTotal.incomeType + `:\n£${monthIncomeTotal.value.toFixed(2)} | ${(monthIncomeTotal.percentage).toFixed(2)}%`;
        })

        monthlyIncomeUpdate = {
            monthTotal: monthlyIncome.monthTotal,
            monthIncomeTotals: monthlyIncome.monthIncomeTotals
        }

        await updateMonthlyIncomeAction(monthlyIncome.id, monthlyIncomeUpdate, "/")
    } else {
        // Print an error if no income could be found
        console.log("No income was found for that month")
    }
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

// export async function getListOfYearsIncomeTotalsByMonth(userId: string) {
//     var monthlyIncomeData: monthData[] = [];
//     const lastTwelveMonths = getLastTwelveMonths();

//     const monthPromises = lastTwelveMonths.map(async (month) => {
//         const startDate = month;
//         const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
//         const { incomes } = await getIncomesBetweenDatesAction({ userId, startDate, endDate });
//         const monthTotal = calculateIncomeTotal(incomes);
//         const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3);
//         monthlyIncomeData.push({ month: monthAsString, value: monthTotal });
//     })

//     await Promise.all(monthPromises);

//     return { monthlyIncomeData };
// }

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

// async function getCategoryIncomeTotalBetweenDates(userId: string, startDate: Date, endDate: Date) {
//     const categoryIncomeRecord: Record<string, number> = {};
//     const { incomes } = await getIncomesBetweenDatesAction({ userId, startDate, endDate });
//     const monthTotal = calculateIncomeTotal(incomes);

//     if (incomes) {
//         for (const income of incomes) {
//             var incomeCategory = income.incomeCategory;
//             const value = income.amount;
//             if (!categoryIncomeRecord[incomeCategory]) {
//                 categoryIncomeRecord[incomeCategory] = 0;
//             }
//             categoryIncomeRecord[incomeCategory] += value;
//         }
//     }

//     const categoryIncomeData: monthCategoryTotal[] = Object.entries(categoryIncomeRecord).map(([incomeCategory, value]) => ({
//         chartTitle: incomeCategory + `:\n£${value.toFixed(2)} | ${((value / monthTotal) * 100).toFixed(2)}%`,
//         categoryName: incomeCategory,
//         value: value,
//         percentage: ((value / monthTotal) * 100),
//     }))

//     return { categoryIncomeData, monthTotal }
// }

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

// export async function getYearOfCategoryIncome(userId: string, months: Date[]) {
//     var yearOfCategoryIncome: categorySplitPieProps[] = [];
//     const monthPromises = months.map(async (month) => {
//         const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
//         const { categoryIncomeData, monthTotal } = await getCategoryIncomeTotalBetweenDates(userId, month, endDate);
//         yearOfCategoryIncome.push({ monthSpendTotals: categoryIncomeData, month, monthTotal });
//     })
//     await Promise.all(monthPromises);
//     const results = yearOfCategoryIncome.length;

//     yearOfCategoryIncome.sort((a, b) => {
//         return b.month.getTime() - a.month.getTime();
//     })

//     return { yearOfCategoryIncome, results };
// }

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________