import startOfMonth from "date-fns/startOfMonth";
import { getIncomesBetweenDatesAction } from "../_incomeActions";
import { getLastTwelveMonths, stringToDate } from "../lib/utils";
import { monthCategoryTotal } from "../models/MonthlyIncome";
import { calculateIncomeTotal } from "./target-calculation-functions";
import { categorySplitPieProps, monthData } from "./trend-graphs";
import { createMonthlyIncomeAction, getMonthlyIncomeByMonthAction, updateMonthlyIncomeAction } from "../_monthlyIncomeActions";

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlyIncomeUpdateForNewIncomes(incomeValue: number, incomeCategory: string, incomeDate: string, userId: string) {
    console.log(typeof(incomeDate))
    console.log(incomeDate)

    const incomeDateMonthStart = startOfMonth(stringToDate(incomeDate))
    const { monthlyIncome } = await getMonthlyIncomeByMonthAction({ month: incomeDateMonthStart, userId });
    console.log("Monthly Income Total")

    if (monthlyIncome) {
        var monthlyIncomeUpdate: {
            monthTotal: number,
            monthCategoryTotals: monthCategoryTotal[]
        }

        var newMonthCategoryTotal: monthCategoryTotal;
        monthlyIncome.monthTotal = monthlyIncome.monthTotal + incomeValue;

        if (monthlyIncome.monthCategoryTotals.some((monthCategoryTotal) => monthCategoryTotal.categoryName === incomeCategory)) {
            // If the category exists in the trends table update it
            const monthCategoryMatch = monthlyIncome.monthCategoryTotals.findIndex((monthCategoryTotal) => monthCategoryTotal.categoryName === incomeCategory);

            monthlyIncome.monthCategoryTotals[monthCategoryMatch].value = monthlyIncome.monthCategoryTotals[monthCategoryMatch].value + incomeValue;
            monthlyIncome.monthCategoryTotals[monthCategoryMatch].percentage = (monthlyIncome.monthCategoryTotals[monthCategoryMatch].value / monthlyIncome.monthTotal) * 100;
            monthlyIncome.monthCategoryTotals[monthCategoryMatch].chartTitle = monthlyIncome.monthCategoryTotals[monthCategoryMatch].categoryName + `:\n£${monthlyIncome.monthCategoryTotals[monthCategoryMatch].value} | ${(monthlyIncome.monthCategoryTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            // Logic for creating a new entry for monthlyCategoryTotals if the category doesn't already exist
            newMonthCategoryTotal = {
                percentage: (incomeValue / monthlyIncome.monthTotal) * 100,
                chartTitle: incomeCategory + `:\n£${incomeValue} | ${((incomeValue / monthlyIncome.monthTotal) * 100).toFixed(2)}%`,
                categoryName: incomeCategory,
                value: incomeValue
            }
            monthlyIncome.monthCategoryTotals.push(newMonthCategoryTotal)
        }

        monthlyIncome.monthCategoryTotals.forEach((monthCategoryTotal) => {
            monthCategoryTotal.percentage = (monthCategoryTotal.value / monthlyIncome.monthTotal) * 100;
            monthCategoryTotal.chartTitle = monthCategoryTotal.categoryName + `:\n£${monthCategoryTotal.value} | ${(monthCategoryTotal.percentage).toFixed(2)}%`;
        })

        monthlyIncomeUpdate = {
            monthTotal: monthlyIncome.monthTotal,
            monthCategoryTotals: monthlyIncome.monthCategoryTotals
        }

        await updateMonthlyIncomeAction(monthlyIncome.id, monthlyIncomeUpdate, "/")
    } else {
        let monthCategoryTotals: monthCategoryTotal[] = [];
        let newMonthCategoryTotal: monthCategoryTotal;
        newMonthCategoryTotal = {
            percentage: 100,
            chartTitle: incomeCategory + `:\n£${incomeValue} | 100%`,
            categoryName: incomeCategory,
            value: incomeValue
        }
        monthCategoryTotals.push(newMonthCategoryTotal)
        await createMonthlyIncomeAction({ month: incomeDateMonthStart, monthTotal: incomeValue, monthCategoryTotals, path: "/", userId })
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
            monthCategoryTotals: monthCategoryTotal[]
        }

        monthlyIncome.monthTotal = monthlyIncome.monthTotal - deletedIncomeValue;

        // If the category exists in the trends table update it
        // If not print an error message
        const monthCategoryMatch = monthlyIncome.monthCategoryTotals.findIndex((monthCategoryTotal) => monthCategoryTotal.categoryName === deletedIncomeCategory);
        if (monthCategoryMatch >= 0) {
            monthlyIncome.monthCategoryTotals[monthCategoryMatch].value = monthlyIncome.monthCategoryTotals[monthCategoryMatch].value - deletedIncomeValue;
            monthlyIncome.monthCategoryTotals[monthCategoryMatch].percentage = (monthlyIncome.monthCategoryTotals[monthCategoryMatch].value / monthlyIncome.monthTotal) * 100;
            monthlyIncome.monthCategoryTotals[monthCategoryMatch].chartTitle = monthlyIncome.monthCategoryTotals[monthCategoryMatch].categoryName + `:\n£${monthlyIncome.monthCategoryTotals[monthCategoryMatch].value} | ${(monthlyIncome.monthCategoryTotals[monthCategoryMatch].percentage).toFixed(2)}%`;
        } else {
            console.log("The category wasn't found")
        }

        // Recalculate the percentages for each of the items
        monthlyIncome.monthCategoryTotals.forEach((monthCategoryTotal) => {
            monthCategoryTotal.percentage = (monthCategoryTotal.value / monthlyIncome.monthTotal) * 100;
            monthCategoryTotal.chartTitle = monthCategoryTotal.categoryName + `:\n£${monthCategoryTotal.value} | ${(monthCategoryTotal.percentage).toFixed(2)}%`;
        })

        monthlyIncomeUpdate = {
            monthTotal: monthlyIncome.monthTotal,
            monthCategoryTotals: monthlyIncome.monthCategoryTotals
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

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________