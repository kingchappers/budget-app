import { createIncomeAction } from "../_incomeActions";
import { CategoryComboBox } from "./comboBox";
import { DatePicker } from "./datePicker";
import { CategoryClass } from "../models/Category";

interface incomeFormProps {
    categories: CategoryClass[];
    userId: string;
}

export function IncomeForm({ categories, userId }: incomeFormProps) {
    async function action(data: FormData) {
        "use server";

        const incomeDate = data.get("pickedDate");
        if (!incomeDate || typeof incomeDate !== "string") {
            return;
        }

        const company = data.get("company");
        if (!company || typeof company !== "string") {
            return;
        }

        const amount = Number(data.get("amount"));
        if (!amount || typeof amount !== "number") {
            return;
        }

        const incomeCategory = data.get("categoryCombobox");
        if (!incomeCategory || typeof incomeCategory !== "string") {
            return;
        }

        const notes = data.get("notes");
        if (typeof notes !== "string") {
            return;
        }

        //For testing / Troubleshooting
        // console.log(typeof value)

        // Invoke server action to add new income
        await createIncomeAction({ incomeDate, company, amount, incomeCategory, notes, userId, path: "/" });
    }

    return (
        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <DatePicker />
            <input type="text" name="company" placeholder="Company" className="border rounded px-1 py-1 w-52" />
            <input type="number" step="any" name="amount" placeholder="Amount" className="border rounded px-1 py-1 w-24" />
            <CategoryComboBox categories={categories} />
            <input type="text" name="notes" placeholder="Notes" className="border rounded px-1 py-1 w-80" />
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}