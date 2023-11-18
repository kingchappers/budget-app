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
                    <td className="px-5"><input type="text" name="label" placeholder="Category" defaultValue={category.label} onChange={(event) => handleInputFieldChange(event, category.label)} className="border rounded px-1 py-1 w-52" /></td>
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

        // <tbody>
        //     {isEditingIncome ? (
        //         <tr>
        //             <td className="px-5"><DatePicker initialDate={income.incomeDate} selectedDate={incomeDate} setSelectedDate={setIncomeDate} /></td>

        //             <td className="px-5"><input type="text" name="company" placeholder="Company" defaultValue={income.company} onChange={(event) => handleInputFieldChange(event, income.company, income.amount, income.incomeCategory, income.notes)} className="border rounded px-1 py-1 w-52" /></td>
        //             <td className="px-5"><input type="number" step="any" name="amount" placeholder="Amount" defaultValue={income.amount} onChange={(event) => handleInputFieldChange(event, income.company, income.amount, income.incomeCategory, income.notes)} className="border rounded px-1 py-1 w-24" /></td>
        //             <td className="px-5"><CategoryComboBox categories={categories} categoriesSelection={categoriesSelection} setCategoriesSelection={setCategoriesSelection} /></td>
        //             <td className="px-5"><input type="text" name="notes" placeholder="Notes" defaultValue={income.notes} onChange={(event) => handleInputFieldChange(event, income.company, income.amount, income.incomeCategory, income.notes)} className="border rounded px-1 py-1 w-80" /></td>
        //             <td className="px-5"><button onClick={() => handleClick(income.id)} className="px-4 py-1 text-white rounded bg-green-500">Save</button></td>


        //         </tr>
        //     ) : (
        //         <tr>
        //             <td className="px-5">{incomeDateString}</td>
        //             <td className="px-5">{income.company}</td>
        //             <td className="px-5">£{income.amount.toFixed(2)}</td>
        //             <td className="px-5">{income.incomeCategory}</td>
        //             <td className="px-5">{income.notes}</td>
        //             <td><IncomeItemMenu income={income} isEditingIncome={isEditingIncome} setIsEditingIncome={setIsEditingIncome} /></td>
        //         </tr >
        //     )}
        // </tbody >
    );
};
