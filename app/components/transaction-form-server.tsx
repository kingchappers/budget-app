import { createTransactionAction } from "../_transactionActions";
import { DatePicker } from "./datePicker";
import { CategoryComboBox } from "./comboBox";
import { CategoryClass } from "../models/Category";

interface TransactionFormProps {
    categories: CategoryClass[];
    userId: string;
}

export function TransactionForm({ categories, userId }: TransactionFormProps) {
    async function action(data: FormData) {
        "use server";

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
        await createTransactionAction({ transactionDate, vendor, value, category, items, notes, userId, path: "/" });
    }

    return (

        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <DatePicker />
            <input type="text" name="vendor" placeholder="Vendor" className="border rounded px-1 py-1 w-52" />
            <input type="number" step="any" name="value" placeholder="Value" className="border rounded px-1 py-1 w-20" />
            <CategoryComboBox categories={categories} />
            <input type="text" name="items" placeholder="Items" className="border rounded px-1 py-1 w-44" />
            <input type="text" name="notes" placeholder="Notes" className="border rounded px-1 py-1 w-80" />
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}