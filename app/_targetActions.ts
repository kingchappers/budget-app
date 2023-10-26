"use server";

import { TargetFilter, createTarget, deleteTarget, getTargets, getTargetsByName, getTargetsByNameAndType, updateTarget } from "./lib/target-db";
import { revalidatePath } from "next/cache";
import { CategoryClass } from "./models/Category";
import { TransactionClass } from "./models/Transaction";
import { calculateIncomeTotal, calculateTargetsTotal, calculateTransactionTotal } from "./components/target-calculation-functions";
import { IncomeClass } from "./models/Income";
import { TargetClass } from "./models/Target";

/**
 * Server Action: Create a new target
 */
export async function createTargetAction({
    categoryName,
    targetAmount,
    expenseTarget,
    userId,
    path
}: {
    categoryName: string;
    targetAmount: number;
    expenseTarget: boolean;
    userId: string;
    path: string;
}) {
    await createTarget(categoryName, targetAmount, expenseTarget, userId);
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

/**
 * Server Action: Delete a target by the category name
 */
export async function deleteTargetsByNameAction(category: CategoryClass, userId: string) {
    let filter: TargetFilter = {
        limit: 50,
        userId: userId,
    }

    const { targets, results } = await getTargetsByName(filter, category.label)

    if (results === 0) {
        return;
    } else {
        targets?.map((target) => {
            deleteTargetAction({ id: target.id, path: "/" })
        });
    }
}

export async function updateTargetsByNameAction(category: CategoryClass, changedValue: string, userId: string) {
    let filter: TargetFilter = {
        limit: 50,
        userId: userId,
    }

    const { targets, results } = await getTargetsByNameAndType(filter, category.label, category.transactionCategory)

    if (changedValue == "transaction") {
        if (!category.transactionCategory) {
            await createTarget(category.label, 0, true, userId);
            console.log("Expense target added")
        } else {
            targets?.map(async (target) => {
                await deleteTarget(target.id)
                console.log("Expense target deleted")
            })
        }
    }

    if (changedValue == "income") {
        if (!category.incomeCategory) {
            await createTarget(category.label, 0, false, userId);
            console.log("Income target deleted")
        } else {
            targets?.map(async (target) => {
                await deleteTarget(target.id)
                console.log("Income target deleted")
            })
        }
    }
}

export async function calculateTransactionTotalAction({
    transactions,
    transactionsResults
}: {
    transactions: TransactionClass[] | undefined,
    transactionsResults: number | undefined
}) {
    if (transactionsResults === 0 || transactionsResults === undefined) {
        return;
    } else {
        const total = await calculateTransactionTotal(transactions);
        return total;
    }
}

export async function calculateIncomeTotalAction({
    incomes,
    incomesResults
}: {
    incomes: IncomeClass[] | undefined,
    incomesResults: number | undefined
}) {
    if (incomesResults === 0 || incomesResults === undefined) {
        return;
    } else {
        const total = await calculateIncomeTotal(incomes);
        return total;
    }
}

export async function getTargetsAction(filter: TargetFilter) {
    const { targets, results } = await getTargets(filter)

    return {
        targets: targets,
        results: results
    };
}


export async function calculateTargetsTotalAction(targets: TargetClass[] | undefined, results: number | undefined){
    if (results === 0 || results === undefined) {
        return 0;
    } else {
        const total = await calculateTargetsTotal(targets);
        return total;
    }
}