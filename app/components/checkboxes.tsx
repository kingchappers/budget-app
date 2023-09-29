"use client";

import { updateTransactionAction } from "../_transactionActions";
import { TransactionClass } from "../models/Transaction";
import { CategoryClass } from "../models/Category";
import { useTransition } from "react";
import { updateCategoryAction } from "../_categoryActions";
import { updateTargetsByNameAction } from "../_targetActions";

type TransactionCheckBoxProps = {
  transaction: TransactionClass;
};

export function TransactionCheckBox({ transaction }: TransactionCheckBoxProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={transaction.checked}
      name="checked"
      onChange={() =>
        startTransition(() =>
          updateTransactionAction(
            transaction.id,
            { checked: !transaction.checked },
            "/with-server-actions"
          )
        )
      }
      disabled={isPending}
      className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
    />
  );
}

type TransactionCategoryCheckBoxProps = {
  category: CategoryClass;
};

export function TransactionCategoryCheckBox({ category }: TransactionCategoryCheckBoxProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={category.transactionCategory}
      name="checked"
      onChange={() =>
        startTransition(() => {
          updateCategoryAction(category.id, { transactionCategory: !category.transactionCategory }, "/with-server-actions")
          updateTargetsByNameAction(category, "transaction")
        })
      }
      disabled={isPending}
      className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
    />
  );
}

type IncomeCategoryCheckBoxProps = {
  category: CategoryClass;
};

export function IncomeCategoryCheckBox({ category }: IncomeCategoryCheckBoxProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={category.incomeCategory}
      name="checked"
      onChange={() =>
        startTransition(() => {
          updateCategoryAction(category.id, { incomeCategory: !category.incomeCategory }, "/with-server-actions")
          updateTargetsByNameAction(category, "income")
        })
      }
      disabled={isPending}
      className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
    />
  );
}