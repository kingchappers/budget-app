"use server";

import { createMonthlySpend, deleteMonthlySpend, updateMonthlySpend, getMonthlySpendsBetweenDates, getMonthlySpendByMonth } from "./lib/monthly-spend-db";
import { revalidatePath } from "next/cache";
import { monthSpendTotal } from "./models/MonthlySpend";
import { calulateMonthlySpendUpdateForDeletedTransactions, calulateMonthlySpendUpdateForEditedTransactions } from "./components/trend-spend-calculations";

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
    monthSpendTotals,
    path,
    userId,
}: {
    month: Date;
    monthTotal: number;
    monthSpendTotals: monthSpendTotal[];
    path: string;
    userId: string;
}) {
    await createMonthlySpend(month, monthTotal, monthSpendTotals, userId);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateMonthlySpendAction(
    id: string,
    update: { month?: Date; monthTotal?: number; monthSpendTotals: monthSpendTotal[]; },
    path: string
) {
    await updateMonthlySpend(id, update);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlySpendUpdateForEditedTransactionsAction(
    oldTransactionValue: number,
    oldTransactionCategory: string,
    oldTransactionDate: Date,
    updatedTransactionValue: number,
    updatedTransactionCategory: string,
    updatedTransactionDate: string,
    userId: string
) {
    await calulateMonthlySpendUpdateForEditedTransactions(oldTransactionValue, oldTransactionCategory, oldTransactionDate, updatedTransactionValue, updatedTransactionCategory, updatedTransactionDate, userId)
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function calulateMonthlySpendUpdateForDeletedTransactionsAction(
    deletedTransactionValue: number,
    deletedTransactionCategory: string,
    deletedTransactionDate: Date,
    userId: string
) {
    await calulateMonthlySpendUpdateForDeletedTransactions(deletedTransactionValue, deletedTransactionCategory, deletedTransactionDate, userId)
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