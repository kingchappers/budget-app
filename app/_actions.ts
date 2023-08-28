"use server";

import { createTransaction, deleteTransaction, updateTransaction } from "./lib/transaction-db";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Create a new transaction
 */
export async function createTransactionAction({
    transactionDate,
    transactionVendor,
    transactionValue,
    transactionCategory,
    transactionItems,
    transcationNotes,
    path,
}: {
    transactionDate: string; 
    transactionVendor: string; 
    transactionValue: number; 
    transactionCategory: string; 
    transactionItems: string; 
    transcationNotes: string;
    path: string;
}) {
    await createTransaction(transactionDate, transactionVendor, transactionValue, transactionCategory, transactionItems, transcationNotes);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing transaction
 */
export async function updateTransactionAction(
    id: string,
    update: { transactionDate?: string; transactionVendor?: string; transactionValue?: number; transactionCategory?: string; transactionItems?: string; transcationNotes?: string; },
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