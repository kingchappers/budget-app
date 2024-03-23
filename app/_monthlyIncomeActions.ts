"use server";

import { createMonthlyIncome, deleteMonthlyIncome, updateMonthlyIncome, getMonthlyIncomes, getMonthlyIncomesBetweenDates } from "./lib/monthly-income-db";
import { revalidatePath } from "next/cache";
import { stringToDate } from "./lib/utils";

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