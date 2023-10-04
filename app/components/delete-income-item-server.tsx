"use client";

import { deleteIncomeAction } from "../_incomeActions";
import { IncomeClass } from "../models/Income";
import { useTransition } from "react";


type deleteButtonProps = {
    income: IncomeClass;
  };

export default function DeleteIncome({ income }: deleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    return(   
        <button onClick={() => startTransition(async () => {
          await deleteIncomeAction({
            id: income.id,
            path: "/"
            })
        })
           } className="px-2 py-1 ml-2 my-1 text-white rounded bg-red-500">Delete</button>

    );
}