"use server";

import { createIncome, deleteIncome, updateIncome } from "./lib/income-db";
import { revalidatePath } from "next/cache";
import { stringToDate } from "./lib/utils";

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
    const parsedIncomeDate = stringToDate(incomeDate)
    await createIncome(parsedIncomeDate, company, amount, incomeCategory, notes);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing income
 */
export async function updateIncomeAction(
    id: string,
    update: { incomeDate?: Date; company?: string; amount?: number; },
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