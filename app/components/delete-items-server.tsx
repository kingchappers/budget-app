"use client";

import { deleteTransactionAction } from "../_transactionActions";
import { deleteIncomeAction } from "../_incomeActions";
import { deleteCategoryAction } from "../_categoryActions";
import { deleteTargetsByNameAction } from "../_targetActions";
import { TransactionClass } from "../models/Transaction";
import { IncomeClass } from "../models/Income";
import { CategoryClass } from "../models/Category";
import { useTransition } from "react";

type transactionDeleteButtonProps = {
    transaction: TransactionClass;
};

type incomeDeleteButtonProps = {
    income: IncomeClass;
};

type categoryDeleteButtonProps = {
    category: CategoryClass;
    userId: string;
};

export function DeleteTransaction({ transaction }: transactionDeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <button onClick={() => startTransition(async () => {
            await deleteTransactionAction({
                id: transaction.id,
                path: "/"
            })
        })
        } className="px-2 py-1 ml-2 my-1 text-white rounded bg-red-500">Delete</button>
    );
}

export function DeleteIncome({ income }: incomeDeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <button onClick={() => startTransition(async () => {
            await deleteIncomeAction({
                id: income.id,
                path: "/"
            })
        })
        } className="px-2 py-1 ml-2 my-1 text-white rounded bg-red-500">Delete</button>

    );
}

export function DeleteCategory({ category, userId }: categoryDeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <button onClick={() => startTransition(async () => {
            await deleteCategoryAction({ id: category.id, path: "/" })
            await deleteTargetsByNameAction(category, userId)
        })
        } className="px-2 py-1 ml-2 my-1 text-white rounded bg-red-500">Delete</button>

    );
}