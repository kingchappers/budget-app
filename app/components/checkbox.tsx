"use client";

import { updateTransactionAction } from "../_actions";
import { TransactionClass } from "../models/Transaction";
import { useTransition } from "react";

type CheckBoxProps = {
    transaction: TransactionClass
}

export default function CheckBox({ transaction }: CheckBoxProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <input 
            type="checkbox" 
            checked={transaction.completed} 
            name="completed" 
            onChange={() => 
                    startTransition(() => 
                        updateTransactionAction(
                            transaction.id, 
                            { completed: !transaction.completed }, 
                            "/with-server-actions"
                        )
                    )
            } 
            disabled={isPending} 
            className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed" />
    );
}