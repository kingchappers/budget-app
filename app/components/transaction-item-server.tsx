"use client"

import { TransactionClass } from "../models/Transaction";
import { DeleteTransaction } from "./delete-items-server";
import { dateToString, stringToDate } from "../lib/utils";
import { TransactionItemMenu } from "./menu-buttons";
import { ChangeEvent, useState } from "react";
import { DatePicker } from "./datePicker";
import { CategoryComboBox } from "./comboBox";
import { CategoryClass } from "../models/Category";
import { updateTransactionAction } from "../_transactionActions";

interface TransactionItemProps {
    transaction: TransactionClass
    categories: CategoryClass[];
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, categories }) => {
    const transactionDateString = dateToString(transaction.transactionDate);
    const [isEditingTransaction, setIsEditingTransaction] = useState(false);

    const [transactionDate, setTransactionDate] = useState(new Date());
    const [vendor, setVendor] = useState("");
    const [value, setValue] = useState(0);
    const [categoriesSelection, setCategoriesSelection] = useState("");
    const [items, setItems] = useState("");
    const [notes, setNotes] = useState("");

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
        updateTransactionAction(id, update, "/")
        setIsEditingTransaction(false)
    }

    async function action(data: FormData) {


        const transactionDate = data.get("pickedDate");
        if (!transactionDate || typeof transactionDate !== "string") {
            return;
        }

        const vendor = data.get("vendor");
        if (!vendor || typeof vendor !== "string") {
            return;
        }

        const value = Number(data.get("value"));
        if (!value || typeof value !== "number") {
            return;
        }

        const category = data.get("categoryCombobox");
        if (!category || typeof category !== "string") {
            return;
        }

        const items = data.get("items");
        if (typeof items !== "string") {
            return;
        }

        const notes = data.get("notes");
        if (typeof notes !== "string") {
            return;
        }

        // Invoke server action to add new transaction
        // await createTransactionAction({ transactionDate, vendor, value, category, items, notes, userId, path: "/" });
        console.log("done")
    }




    return (

        <tbody>
            {isEditingTransaction ? (
                <tr>
                    <td className="px-5"><DatePicker initialDate={transaction.transactionDate} selectedDate={transactionDate} setSelectedDate={setTransactionDate} /></td>
                    <td className="px-5"><input type="text" name="vendor" placeholder="Vendor" defaultValue={transaction.vendor} onChange={() => handleInputFieldChange(this.event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-52" /></td>
                    <td className="px-5"><input type="number" step="any" name="value" placeholder="Value" defaultValue={transaction.value} onChange={() => handleInputFieldChange(transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-20" /></td>
                    <td className="px-5"><CategoryComboBox categories={categories} categoriesSelection={categoriesSelection} setCategoriesSelection={setCategoriesSelection} /></td>
                    <td className="px-5"><input type="text" name="items" placeholder="Items" defaultValue={transaction.items} onChange={() => handleInputFieldChange(transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-44" /></td>
                    <td className="px-5"><input type="text" name="notes" placeholder="Notes" defaultValue={transaction.notes} onChange={() => handleInputFieldChange(transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-80" /></td>
                    {/* <td><TransactionItemMenu transaction={transaction} isEditingTransaction={isEditingTransaction} setIsEditingTransaction={setIsEditingTransaction} /></td> */}
                    <td></td>
                    <td><button onClick={() => handleClick(transaction.id)} className="px-4 py-1 text-white rounded bg-green-500">Add</button></td>
                </tr>
            ) : (
                <tr>
                    <td className="px-5">{transactionDateString}</td>
                    <td className="px-5">{transaction.vendor}</td>
                    <td className="px-5">£{transaction.value.toFixed(2)}</td>
                    <td className="px-5">{transaction.category}</td>
                    <td className="px-5">{transaction.items}</td>
                    <td className="px-5">{transaction.notes}</td>
                    <td><TransactionItemMenu transaction={transaction} isEditingTransaction={isEditingTransaction} setIsEditingTransaction={setIsEditingTransaction} /></td>
                    {/* <td><TransactionItemMenu transaction={transaction} isEditingTransaction={isEditingTransaction} /></td> */}
                    <td>{isEditingTransaction ? (<p>true</p>) : (<p>false</p>)}</td>
                </tr>
            )}


        </tbody>
    );
};

{/* <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <DatePicker />
            <input type="text" name="vendor" placeholder="Vendor" className="border rounded px-1 py-1 w-52" />
            <input type="number" step="any" name="value" placeholder="Value" className="border rounded px-1 py-1 w-20" />
            <CategoryComboBox categories={categories} />
            <input type="text" name="items" placeholder="Items" className="border rounded px-1 py-1 w-44" />
            <input type="text" name="notes" placeholder="Notes" className="border rounded px-1 py-1 w-80" />
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form> */}

// <tr>
//     <td className="px-5">{transactionDateString}</td>
//     <td className="px-5">{transaction.vendor}</td>
//     <td className="px-5">£{transaction.value.toFixed(2)}</td>
//     <td className="px-5">{transaction.category}</td>
//     <td className="px-5">{transaction.items}</td>
//     <td className="px-5">{transaction.notes}</td>
//     <td><TransactionItemMenu transaction={transaction} isEditingTransaction={isEditingTransaction} setIsEditingTransaction={setIsEditingTransaction} /></td>
//     {/* <td><TransactionItemMenu transaction={transaction} isEditingTransaction={isEditingTransaction} /></td> */}
//     <td>{isEditingTransaction ? (<p>true</p>) : (<p>false</p>)}</td>
// </tr>