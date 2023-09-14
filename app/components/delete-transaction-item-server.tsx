"use client";

import { test } from "node:test";
import { deleteTransactionAction } from "../_actions";
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
           } className="px-2 py-1 ml-2 text-white rounded bg-red-500">Delete</button>

        // <form action={action} key={Math.random()} className="flex items-center space-x-2 mb-4">
        //     <input type="text" name="id" className="border rounded px-1 py-1 flex-1"/>
        //     <button className="px-2 py-1 ml-2 text-white rounded bg-red-500">Delete</button>
        // </form>
    );
}