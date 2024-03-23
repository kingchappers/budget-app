import { getIncomesBetweenDatesAction } from "../_incomeActions";
import { getTransactionsBetweenDatesAction } from "../_transactionActions";
import { getLastTwelveMonths } from "../lib/utils";
import { calculateIncomeTotal, calculateTransactionTotal } from "./target-calculation-functions";
import { categoryData, categorySplitPieProps, monthData } from "./trend-graphs";

//_______________________________________________________________________________________________________________________________________
// New Functions below
//_______________________________________________________________________________________________________________________________________

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

// export async function get

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

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

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

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

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function twelveMonthsInOrder() {
    const lastTwelveMonths = getLastTwelveMonths()
    var dateOrder: string[] = [];
    const monthPromises = lastTwelveMonths.map((month) => {
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
        dateOrder.push(monthAsString);
    })
    return dateOrder;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

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

    const categorySpendData: categoryData[] = Object.entries(categorySpendRecord).map(([category, value]) => ({
        chartTitle: category + `:\n£${value} | ${((value / monthTotal) * 100).toFixed(2)}%`,
        categoryName: category,
        value: value,
        percentage: ((value / monthTotal) * 100),
    }))

    return { categorySpendData, monthTotal };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

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

    const categoryIncomeData: categoryData[] = Object.entries(categoryIncomeRecord).map(([incomeCategory, value]) => ({
        chartTitle: incomeCategory + `:\n£${value} | ${((value / monthTotal) * 100).toFixed(2)}%`,
        categoryName: incomeCategory,
        value: value,
        percentage: ((value / monthTotal) * 100),
    }))

    return { categoryIncomeData, monthTotal }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getYearOfCategorySpend(userId: string, months: Date[]) {
    var yearOfCategorySpend: categorySplitPieProps[] = [];
    const monthPromises = months.map(async (month) => {
        const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const { categorySpendData, monthTotal } = await getCategoryTransactionTotalBetweenDates(userId, month, endDate);
        yearOfCategorySpend.push({ categoryData: categorySpendData, month, monthTotal });
    })
    await Promise.all(monthPromises);
    const results = yearOfCategorySpend.length;

    yearOfCategorySpend.sort((a, b) => {
        return b.month.getTime() - a.month.getTime();
    })

    return { yearOfCategorySpend, results };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getYearOfCategoryIncome(userId: string, months: Date[]) {
    var yearOfCategoryIncome: categorySplitPieProps[] = [];
    const monthPromises = months.map(async (month) => {
        const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const { categoryIncomeData, monthTotal } = await getCategoryIncomeTotalBetweenDates(userId, month, endDate);
        yearOfCategoryIncome.push({ categoryData: categoryIncomeData, month, monthTotal });
    })
    await Promise.all(monthPromises);
    const results = yearOfCategoryIncome.length;

    yearOfCategoryIncome.sort((a, b) => {
        return b.month.getTime() - a.month.getTime();
    })

    return { yearOfCategoryIncome, results };
}