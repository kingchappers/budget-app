"use server";

import { createMonthlyIncome, deleteMonthlyIncome, updateMonthlyIncome, getMonthlyIncomesBetweenDates, getMonthlyIncomeByMonth } from "./lib/monthly-income-db";
import { revalidatePath } from "next/cache";
import { monthCategoryTotal } from "./models/MonthlyIncome";
import { calulateMonthlyIncomeUpdateForDeletedIncomes, calulateMonthlyIncomeUpdateForEditedIncomes } from "./components/trend-income-calculations";

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlyIncomesBetweenDatesAction({
    userId,
    startDate,
    endDate,
}: {
    userId: string;
    startDate: Date;
    endDate: Date;
}) {
    const { monthlyIncomes, results } = await getMonthlyIncomesBetweenDates({ userId }, startDate, endDate)

    return {
        monthlyIncomes: monthlyIncomes,
        results
    };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlyIncomeByMonthAction({
    month,
    userId,
}: {
    month: Date;
    userId: string;
}) {
    const { monthlyIncome } = await getMonthlyIncomeByMonth({ userId }, month)

    return {
        monthlyIncome: monthlyIncome
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createMonthlyIncomeAction({
    month,
    monthTotal,
    monthCategoryTotals,
    path,
    userId,
}: {
    month: Date;
    monthTotal: number;
    monthCategoryTotals: object;
    path: string;
    userId: string;
}) {
    await createMonthlyIncome(month, monthTotal, monthCategoryTotals, userId);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateMonthlyIncomeAction(
    id: string,
    update: { month?: Date; monthTotal?: number; monthCategoryTotals?: object; },
    path: string
) {
    await updateMonthlyIncome(id, update);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlyIncomeUpdateForEditedIncomesAction(
    oldIncomeValue: number,
    oldIncomeCategory: string,
    oldIncomeDate: Date,
    updatedIncomeValue: number,
    updatedIncomeCategory: string,
    updatedIncomeDate: string,
    userId: string
) {
    await calulateMonthlyIncomeUpdateForEditedIncomes(oldIncomeValue, oldIncomeCategory, oldIncomeDate, updatedIncomeValue, updatedIncomeCategory, updatedIncomeDate, userId)
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlyIncomeUpdateForDeletedIncomesAction(
    deletedIncomeValue: number,
    deletedIncomeCategory: string,
    deletedIncomeDate: Date,
    userId: string
) {
    await calulateMonthlyIncomeUpdateForDeletedIncomesAction(deletedIncomeValue, deletedIncomeCategory, deletedIncomeDate, userId)
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteMonthlyIncomeAction({
    id,
    path,
}: {
    id: string;
    path: string;
}) {
    await deleteMonthlyIncome(id);
    revalidatePath(path);
}