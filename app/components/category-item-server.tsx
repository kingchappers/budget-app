"use client"

import { IncomeCategoryCheckBox, TransactionCategoryCheckBox } from "./checkboxes";
import { CategoryClass } from "../models/Category";
import { ChangeEvent, useState } from "react";
import { updateCategoryAction } from "../_categoryActions";
import { getTargetsByNameAction, updateTargetAction } from "../_targetActions";
import { CategoryItemMenu } from "./menu-buttons";

interface CategoryItemProps {
    category: CategoryClass;
    userId: string;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ category, userId }) => {
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [label, setLabel] = useState(category.label);
    const originalLabel = category.label;

    console.log("Categories passed to UI")
    console.log(category)

    function handleInputFieldChange(event: ChangeEvent<HTMLInputElement>, label: string) {
        const target = event.target as HTMLInputElement;

        if (target.name === 'label') {
            setLabel(target.value);
        }
    }

    async function handleClick(id: string) {
        const categoryUpdate = {
            label: label,
        }

        if (typeof label !== 'string') {
            return;
        }

        updateCategoryAction(id, categoryUpdate, "/")

        await getTargetsByNameAction(originalLabel, userId).then(({ targets }) => {
            targets?.forEach(target => {
                const targetUpdate = {
                    categoryName: label,
                }
                updateTargetAction(target.id, targetUpdate, "/")
            });
        })

        setIsEditingCategory(false)
    }

    return (
        <tbody>
            {isEditingCategory ? (
                <tr>
                    <td className="px-5"><input autoComplete="off" type="text" name="label" placeholder="Category" defaultValue={category.label} onChange={(event) => handleInputFieldChange(event, category.label)} className="border rounded px-1 py-1 w-52" /></td>
                    <td className="text-center"><TransactionCategoryCheckBox category={category} userId={userId} /></td>
                    <td className="text-center"><IncomeCategoryCheckBox category={category} userId={userId} /></td>
                    <td className="px-5"><button onClick={() => handleClick(category.id)} className="px-4 py-1 text-white rounded bg-green-500">Save</button></td>
                </tr>
            ) : (
                <tr>
                    <td className="px-5">{category.label}</td>
                    <td className="text-center"><TransactionCategoryCheckBox category={category} userId={userId} /></td>
                    <td className="text-center"><IncomeCategoryCheckBox category={category} userId={userId} /></td>
                    <td><CategoryItemMenu category={category} isEditingCategory={isEditingCategory} setIsEditingCategory={setIsEditingCategory} /></td>
                </tr>
            )}
        </tbody>
    );
};
