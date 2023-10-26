"use server";

import { createCategory, deleteCategory, updateCategory, getCategories, CategoryFilter } from "./lib/categories-db";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Create a new category
 */
export async function createCategoryAction({
    label,
    transactionCategory,
    incomeCategory,
    userId,
    path
}: {
    label: string;
    transactionCategory: boolean;
    incomeCategory: boolean;
    userId: string,
    path: string;
}) {
    await createCategory(label, transactionCategory, incomeCategory, userId);
    revalidatePath(path);
}

/**
 * Server Action: Update an existing category
 */
export async function updateCategoryAction(
    id: string,
    update: { label?: string; transactionCategory?: boolean; incomeCategory?: boolean; },
    path: string
) {
    await updateCategory(id, update);
    revalidatePath(path);
}

/**
 * Server Action: Delete a category
 */
export async function deleteCategoryAction({
    id,
    path,
}: {
    id: string;
    path: string;
}) {
    await deleteCategory(id);
    revalidatePath(path);
}

export async function getCategoriesAction(userId: string) {
    let filter: CategoryFilter = {
        userId: userId
    }
    const categories = await getCategories(filter);
    return (
        categories
    )
}