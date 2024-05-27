"use client"

import { IncomeClass } from "../models/Income";
import { dateToString, dateToStringInputFormat, stringToDateInputFormat } from "../lib/utils";
import { IncomeItemMenu } from "./menu-buttons";
import { ChangeEvent, useState } from "react";
import { CategoryClass } from "../models/Category";
import { CategoryComboBox } from "./comboBox";
import { getIncomeAction, updateIncomeAction } from "../_incomeActions";
import { calulateMonthlyIncomeUpdateForEditedIncomesAction } from "../_monthlyIncomeActions";


interface IncomeItemProps {
    income: IncomeClass;
    categories: CategoryClass[];
    userId: string;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export const IncomeItem: React.FC<IncomeItemProps> = ({ income, categories, userId }) => {
    const incomeDateString = dateToString(income.incomeDate)
    const [isEditingIncome, setIsEditingIncome] = useState(false);
    const [incomeDate, setIncomeDate] = useState(income.incomeDate);
    const [company, setCompany] = useState(income.company);
    const [amount, setAmount] = useState(income.amount);
    const [categoriesSelection, setCategoriesSelection] = useState(income.incomeCategory);
    const [notes, setNotes] = useState(income.notes);

    function handleInputFieldChange(event: ChangeEvent<HTMLInputElement>, incomeDate: Date, company: string, amount: number, category: string, notes: string) {
        const target = event.target as HTMLInputElement;

        if (target.name === 'pickedDate') {
            setIncomeDate(stringToDateInputFormat(target.value));
        } else if (target.name === 'company') {
            setCompany(target.value);
        } else if (target.name == 'amount') {
            setAmount(Number(target.value));
        } else if (target.name === 'incomeCategory') {
            setCategoriesSelection(target.value);
        } else if (target.name === 'notes') {
            setNotes(target.value);
        }
    }

    async function handleClick(id: string) {
        const update = {
            incomeDate: incomeDate,
            company: company,
            amount: amount,
            category: categoriesSelection,
            notes: notes,
        }

        if (typeof incomeDate !== 'object') {
            return;
        }
        if (typeof company !== 'string') {
            return;
        }
        if (typeof amount !== 'number') {
            return;
        }
        if (typeof categoriesSelection !== 'string') {
            return;
        }
        if (typeof notes !== 'string') {
            return;
        }

        // Update the trend incomes table
        const { income: oldIncome } = await getIncomeAction({ id })
        if (oldIncome) {
            let updatedIncomeDateString = dateToStringInputFormat(update.incomeDate)
            calulateMonthlyIncomeUpdateForEditedIncomesAction(oldIncome.amount, oldIncome.incomeCategory, oldIncome.incomeDate, update.amount, update.category, updatedIncomeDateString, userId)
        }

        updateIncomeAction(id, update, "/")
        setIsEditingIncome(false)
    }

    return (
        <tbody>
            {isEditingIncome ? (
                <tr>
                    <td className="px-3 lg:px-5"><input aria-label="Date" type="date" name="pickedDate" pattern="dd/mm/yyyy" defaultValue={dateToStringInputFormat(incomeDate)} onChange={(event) => handleInputFieldChange(event, income.incomeDate, income.company, income.amount, income.incomeCategory, income.notes)} className="border rounded px-1 py-1 w-24 lg:w-32" /></td>
                    <td className="px-3 lg:px-5"><input autoComplete="off" type="text" name="company" placeholder="Company" defaultValue={income.company} onChange={(event) => handleInputFieldChange(event, income.incomeDate, income.company, income.amount, income.incomeCategory, income.notes)} className="border rounded px-1 py-1 w-24 lg:w-48" /></td>
                    <td className="px-3 lg:px-5"><input autoComplete="off" type="number" step="any" name="amount" placeholder="Amount" defaultValue={income.amount} onChange={(event) => handleInputFieldChange(event, income.incomeDate, income.company, income.amount, income.incomeCategory, income.notes)} className="border rounded px-1 py-1 w-16 lg:w-24" /></td>
                    <td className="px-3 lg:px-5"><CategoryComboBox categories={categories} categoriesSelection={categoriesSelection} setCategoriesSelection={setCategoriesSelection} /></td>
                    <td className="px-3 lg:px-5"><input autoComplete="off" type="text" name="notes" placeholder="Notes" defaultValue={income.notes} onChange={(event) => handleInputFieldChange(event, income.incomeDate, income.company, income.amount, income.incomeCategory, income.notes)} className="border rounded px-1 py-1 w-24 lg:w-80" /></td>
                    <td className="px-3 lg:px-5"><button onClick={() => handleClick(income.id)} className="px-4 py-1 text-white rounded bg-green-500">Save</button></td>


                </tr>
            ) : (
                <tr>
                    <td className="px-3 lg:px-5">{incomeDateString}</td>
                    <td className="px-3 lg:px-5">{income.company}</td>
                    <td className="px-3 lg:px-5">£{income.amount.toFixed(2)}</td>
                    <td className="px-3 lg:px-5">{income.incomeCategory}</td>
                    <td className="px-3 lg:px-5">{income.notes}</td>
                    <td><IncomeItemMenu income={income} isEditingIncome={isEditingIncome} setIsEditingIncome={setIsEditingIncome} /></td>
                </tr >
            )}
        </tbody >
    );
};

