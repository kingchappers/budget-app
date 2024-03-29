"use server";

import { createMonthlySpend, deleteMonthlySpend, updateMonthlySpend, getMonthlySpend, getMonthlySpendsBetweenDates, getMonthlySpendByMonth } from "./lib/monthly-spend-db";
import { revalidatePath } from "next/cache";
import { monthCategoryTotal } from "./models/MonthlySpend";
import { stringToObjectId } from "./lib/utils";

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlySpendsBetweenDatesAction({
    userId,
    startDate,
    endDate,
}: {
    userId: string;
    startDate: Date;
    endDate: Date;
}) {
    const { monthlySpends, results } = await getMonthlySpendsBetweenDates({ userId }, startDate, endDate)

    return {
        monthlySpends: monthlySpends,
        results
    };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlySpendByMonthAction({
    month,
    userId,
}: {
    month: Date;
    userId: string;
}) {
    const { monthlySpend } = await getMonthlySpendByMonth({ userId }, month)

    return {
        monthlySpend: monthlySpend
    }
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
    month: Date;
    monthTotal: number;
    monthCategoryTotals: monthCategoryTotal[];
    path: string;
    userId: string;
}) {
    await createMonthlySpend(month, monthTotal, monthCategoryTotals, userId);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateMonthlySpendAction(
    id: string,
    update: { month?: Date; monthTotal?: number; monthCategoryTotals: monthCategoryTotal[]; },
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