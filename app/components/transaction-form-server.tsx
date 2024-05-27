import { createTransactionAction } from "../_transactionActions";
import { CategoryComboBox } from "./comboBox";
import { CategoryClass } from "../models/Category";
import { FormAddButton } from "./form-submit-buttons";
import { calulateMonthlySpendUpdateForNewTransactions } from "./trend-spend-calculations";
import { dateToStringInputFormat } from "../lib/utils";

interface TransactionFormProps {
    categories: CategoryClass[];
    userId: string;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

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

        // Calculate the trend spends for the new transaction
        await calulateMonthlySpendUpdateForNewTransactions(value, category, transactionDate, userId);
    }

    return (

        <form autoComplete="off" action={action} key={Math.random()} className="flex flex-wrap items-center space-x-1 lg:space-x-3 mb-4">
            <input aria-label="Date" type="date" name="pickedDate" pattern="dd/mm/yyyy" className="border rounded px-1 py-1 w-24 lg:w-32" /> {/*defaultValue={dateToStringInputFormat(new Date)} */} 
            <input type="text" name="vendor" placeholder="Vendor" className="border rounded px-1 py-1 w-24 lg:w-40" />
            <input type="number" step="any" name="value" placeholder="Value" className="border rounded px-1 py-1 w-16 lg:w-20" />
            <CategoryComboBox categories={categories} />
            <input type="text" name="items" placeholder="Items" className="border rounded px-1 py-1 w-24 lg:w-44" />
            <input type="text" name="notes" placeholder="Notes" className="border rounded px-1 py-1 w-24 lg:w-80" />
            <FormAddButton />
        </form>
    );
}