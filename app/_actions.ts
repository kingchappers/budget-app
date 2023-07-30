"use server";

import { createTransaction, deleteTransaction, updateTransaction } from "./lib/transaction-db";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Create a new transaction
 */
export async function createTransactionAction({
    title,
    path,
}: {
    title: string;
    path: string;
}) {
    await createTransaction(title);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing transaction
 */
export async function updateTransactionAction(
    id: string,
    update: {title?: string; completed?: boolean },
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