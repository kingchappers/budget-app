"use server";

import { createMonthlySpend, deleteMonthlySpend, updateMonthlySpend, getMonthlySpend, getMonthlySpendsBetweenDates } from "./lib/monthly-spend-db";
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
    const { mothlySpends, results } = await getMonthlySpendsBetweenDates({ userId }, startDate, endDate)

    return {
        mothlySpends: mothlySpends,
        results
    };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createMonthlySpendAction({
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
    await createMonthlySpend(parsedMonth, monthTotal, monthCategoryTotals, userId);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateMonthlySpendAction(
    id: string,
    update: { month?: Date; monthTotal?: number; monthCategoryTotals: object; },
    path: string
) {
    await updateMonthlySpend(id, update);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteMonthlySpendAction({
    id,
    path,
}: {
    id: string;
    path: string;
}) {
    await deleteMonthlySpend(id);
    revalidatePath(path);
}