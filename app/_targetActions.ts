"use server";

import { create } from "domain";
import { createTarget, deleteTarget, updateTarget } from "./lib/target-db";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Create a new target
 */
export async function createTargetAction({
    categoryName,
    targetAmount,
    expenseTarget,
    path
}: {
    categoryName: string; 
    targetAmount: number; 
    expenseTarget: boolean; 
    path: string;
}) {
    await createTarget(categoryName, targetAmount, expenseTarget);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing target
 */
export async function updateTargetAction(
    id: string,
    update: { categoryName?: string; targetAmount?: number; expenseTarget?: boolean; }, 
    path: string
) {
    await updateTarget(id, update);
    revalidatePath(path);
}

/**
 * Server Action: Delete a target
 */
export async function deleteTargetAction({
    id,
    path,
}: {
    id: string;
    path: string;
}) {
    await deleteTarget(id);
    revalidatePath(path);
}