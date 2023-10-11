"use client";

import { deleteCategoryAction } from "../_categoryActions";
import { deleteTargetsByNameAction } from "../_targetActions";
import { CategoryClass } from "../models/Category";
import { useTransition } from "react";


type deleteButtonProps = {
    category: CategoryClass;
};

export default function DeleteCategory({ category }: deleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <button onClick={() => startTransition(async () => {
            await deleteCategoryAction({ id: category.id, path: "/" })
            await deleteTargetsByNameAction(category)
        })
        } className="px-2 py-1 ml-2 my-1 text-white rounded bg-red-500">Delete</button>

    );
}