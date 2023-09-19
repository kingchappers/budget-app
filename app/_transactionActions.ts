"use server";

import { createTransaction, deleteTransaction, updateTransaction } from "./lib/transaction-db";
import { revalidatePath } from "next/cache";

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
}: {
    transactionDate: string; 
    vendor: string; 
    value: number; 
    category: string; 
    items: string; 
    notes: string;
    path: string;
}) {
    await createTransaction(transactionDate, vendor, value, category, items, notes);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing transaction
 */
export async function updateTransactionAction(
    id: string,
    update: { transactionDate?: string; vendor?: string; value?: number; checked?: boolean; }, 
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