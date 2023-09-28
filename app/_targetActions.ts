"use server";

import { create } from "domain";
import { TargetFilter, createTarget, deleteTarget, getTargetsByName, updateTarget } from "./lib/target-db";
import { revalidatePath } from "next/cache";
import { CategoryClass } from "./models/Category";

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

export async function deleteTargetsByNameAction(category: CategoryClass){
    let filter: TargetFilter = {
      limit: 50
    }
  
    const test = category.label.toString()
  
    let { targets, results } = await getTargetsByName(filter, category.label)
  
    if(results === 0){
      return;
    } else {
      targets?.map((target) => {
         deleteTargetAction({ id: target.id, path: "/" })
      });
    }
  
  }