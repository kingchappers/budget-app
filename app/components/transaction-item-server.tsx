"use client"

import { TransactionClass } from "../models/Transaction";
import { dateToString, stringToDate } from "../lib/utils";
import { TransactionItemMenu } from "./menu-buttons";
import { ChangeEvent, useState } from "react";
import { DatePicker } from "./datePicker";
import { CategoryComboBox } from "./comboBox";
import { CategoryClass } from "../models/Category";
import { getTransactionAction, updateTransactionAction } from "../_transactionActions";
import { calulateMonthlySpendUpdateForEditedTransactionsAction } from "../_monthlySpendActions";

interface TransactionItemProps {
    transaction: TransactionClass;
    categories: CategoryClass[];
    userId: string;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, categories, userId }) => {
    const transactionDateString = dateToString(transaction.transactionDate);
    const [isEditingTransaction, setIsEditingTransaction] = useState(false);
    const [transactionDate, setTransactionDate] = useState(transaction.transactionDate);
    const [vendor, setVendor] = useState(transaction.vendor);
    const [value, setValue] = useState(transaction.value);
    const [categoriesSelection, setCategoriesSelection] = useState(transaction.category);
    const [items, setItems] = useState(transaction.items);
    const [notes, setNotes] = useState(transaction.notes);

    function handleInputFieldChange(event: ChangeEvent<HTMLInputElement>, vendor: string, value: number, category: string, items: string, notes: string) {
        const target = event.target as HTMLInputElement;

        if (target.name === 'transactionDate') {
            setTransactionDate(stringToDate(target.value));
        } else if (target.name === 'vendor') {
            setVendor(target.value);
        } else if (target.name == 'value') {
            setValue(Number(target.value));
        } else if (target.name === 'category') {
            setCategoriesSelection(target.value);
        } else if (target.name === 'items') {
            setItems(target.value);
        } else if (target.name === 'notes') {
            setNotes(target.value);
        }
    }

    async function handleClick(id: string) {
        const update = {
            transactionDate: transactionDate,
            vendor: vendor,
            value: value,
            category: categoriesSelection,
            items: items,
            notes: notes,
        }

        if (typeof transactionDate !== 'object') {
            return;
        }
        if (typeof vendor !== 'string') {
            return;
        }
        if (typeof value !== 'number') {
            return;
        }
        if (typeof categoriesSelection !== 'string') {
            return;
        }
        if (typeof items !== 'string') {
            return;
        }
        if (typeof notes !== 'string') {
            return;
        }

        // Update the trend spends table
        const { transaction: oldTransaction } = await getTransactionAction({ id })
        if (oldTransaction) {
            let updatedTransactionDateString = dateToString(update.transactionDate)
            await calulateMonthlySpendUpdateForEditedTransactionsAction(oldTransaction.value, oldTransaction.category, oldTransaction.transactionDate, update.value, update.category, updatedTransactionDateString, userId)
        }

        // Update the transactions table
        updateTransactionAction(id, update, "/")
        setIsEditingTransaction(false)
    }

    return (

        <tbody>
            {isEditingTransaction ? (
                <tr>
                    <td className="px-3 lg:px-5"><DatePicker initialDate={transaction.transactionDate} selectedDate={transactionDate} setSelectedDate={setTransactionDate} /></td>
                    <td className="px-3 lg:px-5"><input autoComplete="off" type="text" name="vendor" placeholder="Vendor" defaultValue={transaction.vendor} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-24 lg:w-44" /></td>
                    <td className="px-3 lg:px-5"><input autoComplete="off" type="number" step="any" name="value" placeholder="Value" defaultValue={transaction.value} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-20" /></td>
                    <td className="px-3 lg:px-5"><CategoryComboBox categories={categories} categoriesSelection={categoriesSelection} setCategoriesSelection={setCategoriesSelection} /></td>
                    <td className="px-3 lg:px-5"><input autoComplete="off" type="text" name="items" placeholder="Items" defaultValue={transaction.items} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-44" /></td>
                    <td className="px-3 lg:px-5"><input autoComplete="off" type="text" name="notes" placeholder="Notes" defaultValue={transaction.notes} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-80" /></td>
                    <td><button onClick={() => handleClick(transaction.id)} className="px-4 py-1 text-white rounded bg-green-500">Save</button></td>
                </tr>
            ) : (
                <tr>
                    <td className="px-3 lg:px-5">{transactionDateString}</td>
                    <td className="px-3 lg:px-5">{transaction.vendor}</td>
                    <td className="px-3 lg:px-5">£{transaction.value.toFixed(2)}</td>
                    <td className="px-3 lg:px-5">{transaction.category}</td>
                    <td className="px-3 lg:px-5">{transaction.items}</td>
                    <td className="px-3 lg:px-5">{transaction.notes}</td>
                    <td><TransactionItemMenu transaction={transaction} isEditingTransaction={isEditingTransaction} setIsEditingTransaction={setIsEditingTransaction} /></td>
                </tr>
            )}


        </tbody>
    );
};
