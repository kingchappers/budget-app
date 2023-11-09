"use server";

import { createTransaction, deleteTransaction, updateTransaction, getTransactionsBetweenDates } from "./lib/transaction-db";
import { revalidatePath } from "next/cache";
import { stringToDate } from "./lib/utils";

/**
 * Server Action: Get a transactions between dates
 */
export async function getTransactionsBetweenDatesAction({
    userId,
    startDate,
    endDate,
}: {
    userId: string;
    startDate: Date;
    endDate: Date;
}) {
    const { transactions, results } = await getTransactionsBetweenDates({ userId }, startDate, endDate)

    return {
        transactions: transactions,
        results
    };
}

/**
 * Server Action: Create a new transaction
 */
export async function createTransactionAction({
    transactionDate,
    vendor,
    value,
    category,
    items,
    notes,
    path,
    userId,
}: {
    transactionDate: string;
    vendor: string;
    value: number;
    category: string;
    items: string;
    notes: string;
    path: string;
    userId: string;
}) {
    const parsedTransactionDate = stringToDate(transactionDate)
    await createTransaction(parsedTransactionDate, vendor, value, category, items, notes, userId);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing transaction
 */
export async function updateTransactionAction(
    id: string,
    update: { transactionDate?: Date; vendor?: string; value?: number; category?: string, items?: string; notes?: string; checked?: boolean; },
    path: string
) {
    await updateTransaction(id, update);
    revalidatePath(path);
}

/**
 * Server Action: Delete a transaction
 */
export async function deleteTransactionAction({
    id,
    path,
}: {
    id: string;
    path: string;
}) {
    await deleteTransaction(id);
    revalidatePath(path);
}