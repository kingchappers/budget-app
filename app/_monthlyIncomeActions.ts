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
    const { mothlyIncomes, results } = await getMonthlyIncomesBetweenDates({ userId }, startDate, endDate)

    return {
        mothlyIncomes: mothlyIncomes,
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
    month: string;
    monthTotal: number;
    monthCategoryTotals: object;
    path: string;
    userId: string;
}) {
    const parsedMonth = stringToDate(month)
    await createMonthlyIncome(parsedMonth, monthTotal, monthCategoryTotals, userId);
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