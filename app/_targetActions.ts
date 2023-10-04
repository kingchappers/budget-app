"use server";

import { TargetFilter, createTarget, deleteTarget, getTargetsByName, getTargetsByNameAndType, updateTarget } from "./lib/target-db";
import { revalidatePath } from "next/cache";
import { CategoryClass } from "./models/Category";
import { IncomeClass } from "./models/Income";
import { TransactionClass } from "./models/Transaction";
import { calculateTransactionTotal } from "./components/target-calculation-functions";

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

/**
 * Server Action: Delete a target by the category name
 */
export async function deleteTargetsByNameAction(category: CategoryClass){
    let filter: TargetFilter = {
      limit: 50
    }
    
    const { targets, results } = await getTargetsByName(filter, category.label)
  
    if(results === 0){
        return;
    } else {
        targets?.map((target) => {
            deleteTargetAction({ id: target.id, path: "/" })
        });
    }
}

export async function updateTargetsByNameAction(category: CategoryClass, changedValue: string){
    let filter: TargetFilter = {
        limit: 50
    }
      
    const { targets, results } = await getTargetsByNameAndType(filter, category.label, category.transactionCategory)

    console.log("Targets found: " + {targets})
    console.log("transactionCategory value: " + category.transactionCategory)
    console.log("incomeCategory value: " + category.incomeCategory)

    if(changedValue == "transaction"){
        if(!category.transactionCategory){
            await createTarget(category.label, 0 , true);
            console.log("Expense target added")
        } else {
            targets?.map(async (target) => {
                await deleteTarget(target.id)
                console.log("Expense target deleted")
            })
        }
    }

    if(changedValue == "income"){
        if(!category.incomeCategory){
            await createTarget(category.label, 0 , false);
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
    results
} : {
    transactions: TransactionClass[] | undefined,
    results: number | undefined}){
    if(results === 0 || results === undefined){
        return;
    } else {
        const total = await calculateTransactionTotal(transactions);
        return total;
    }
}



// export function calculateIncomeTotal(incomes: IncomeClass[] | undefined){
//     let incomeTotal: number = 0

//     if(incomes === undefined){
//         return(incomeTotal);
//     } else {
//         for(const income of incomes){
//             incomeTotal = incomeTotal + income.amount
//         }
//     }

//     return(incomeTotal);
// }

// export function calculateTransactionTotal(transactions: TransactionClass[] | undefined){
//     let transactionTotal: number = 0

//     if(transactions === undefined){
//         return(transactionTotal);
//     } else {
//         for(const transaction of transactions){
//             transactionTotal = transactionTotal + transaction.value
//         }
//     }

//     return(transactionTotal);
// }
