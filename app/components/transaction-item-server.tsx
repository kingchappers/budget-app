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

        if (typeof transactionDate !== 'object') {
            console.log(typeof (transactionDate))
            console.log(transactionDate)
            return;
        }

        if (typeof vendor !== 'string') {
            console.log(typeof (vendor))
            console.log(vendor)
            console.log("vendor")
            return;
        }

        if (typeof value !== 'number') {
            console.log(typeof (value))
            console.log(value)
            console.log("value")
            return;
        }

        if (typeof categoriesSelection !== 'string') {
            console.log(typeof (categoriesSelection))
            console.log(categoriesSelection)
            console.log("categoriesSelection")

            return;
        }

        if (typeof items !== 'string') {
            console.log(typeof (items))
            console.log(items)
            console.log("items")

            return;
        }

        if (typeof notes !== 'string') {
            console.log(typeof (notes))
            console.log(notes)
            console.log("notes")

            return;
        }

        updateTransactionAction(id, update, "/")
        setIsEditingTransaction(false)
    }

    return (

        <tbody>
            {isEditingTransaction ? (
                <tr>
                    <td className="px-5"><DatePicker initialDate={transaction.transactionDate} selectedDate={transactionDate} setSelectedDate={setTransactionDate} /></td>
                    <td className="px-5"><input type="text" name="vendor" placeholder="Vendor" defaultValue={transaction.vendor} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-52" /></td>
                    <td className="px-5"><input type="number" step="any" name="value" placeholder="Value" defaultValue={transaction.value} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-20" /></td>
                    <td className="px-5"><CategoryComboBox categories={categories} categoriesSelection={categoriesSelection} setCategoriesSelection={setCategoriesSelection} /></td>
                    <td className="px-5"><input type="text" name="items" placeholder="Items" defaultValue={transaction.items} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-44" /></td>
                    <td className="px-5"><input type="text" name="notes" placeholder="Notes" defaultValue={transaction.notes} onChange={(event) => handleInputFieldChange(event, transaction.vendor, transaction.value, transaction.category, transaction.items, transaction.notes)} className="border rounded px-1 py-1 w-80" /></td>
                    {/* <td><TransactionItemMenu transaction={transaction} isEditingTransaction={isEditingTransaction} setIsEditingTransaction={setIsEditingTransaction} /></td> */}
                    <td></td>
                    <td><button onClick={() => handleClick(transaction.id)} className="px-4 py-1 text-white rounded bg-green-500">Save Changes</button></td>
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
