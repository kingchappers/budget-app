"use server";

import { createIncome, deleteIncome, updateIncome } from "./lib/income-db";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Create a new income
 */
export async function createIncomeAction({
    incomeDate,
    company,
    amount,
    incomeCategory,
    notes,
    path,
}: {
    incomeDate: string; 
    company: string; 
    amount: number; 
    incomeCategory: string; 
    notes: string;
    path: string;
}) {
    await createIncome(incomeDate, company, amount, incomeCategory, notes);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing income
 */
export async function updateIncomeAction(
    id: string,
    update: { incomeDate?: string; company?: string; amount?: number; }, 
    path: string
) {
    await updateIncome(id, update);
    revalidatePath(path);
}

/**
 * Server Action: Delete a income
 */
export async function deleteIncomeAction({
    id,
    path,
}: {
    id: string;
    path: string;
}) {
    await deleteIncome(id);
    revalidatePath(path);
}