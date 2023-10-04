"use client";

import { deleteTransactionAction } from "../_transactionActions";
import { TransactionClass } from "../models/Transaction";
import { useTransition } from "react";

type deleteButtonProps = {
    transaction: TransactionClass;
  };

export default function DeleteTransaction({ transaction }: deleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    return(   
        <button onClick={() => startTransition(async () => {
          await deleteTransactionAction({
            id: transaction.id,
            path: "/"
            })
        })
           } className="px-2 py-1 ml-2 my-1 text-white rounded bg-red-500">Delete</button>
    );
}