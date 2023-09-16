import { createTransactionAction } from "../_actions";
import DatePicker from "./datePicker";

export default function TransactionForm() {
    async function action(data: FormData) {
        "use server";

        const transactionDate = data.get("pickedDate");
        if (!transactionDate || typeof transactionDate !== "string"){
            return;
        }

        const vendor = data.get("vendor");
        if (!vendor || typeof vendor !== "string"){
            return;
        }

        const value = Number(data.get("value"));
        if (!value || typeof value !== "number"){
            const test = typeof value
            console.log(typeof test)
            return;
        }
        
        const category = data.get("category");
        if (!category || typeof category !== "string"){
            return;
        }

        const items = data.get("items");
        if (typeof items !== "string"){
            return;
        }

        const notes = data.get("notes");
        if (typeof notes !== "string"){
            return;
        }


        //For testing / Troubleshooting
        // console.log(typeof value)

        // Invoke server action to add new transaction
        await createTransactionAction({ transactionDate, vendor, value, category, items, notes, path: "/" }); 
    }

    return(      

        <form action={action} key={Math.random()} className="flex items-center space-x-2 mb-4">
            <DatePicker />
            <input type="text" name="vendor" placeholder="Vendor" className="border rounded px-1 py-1 w-56"/>
            <input type="number" name="value" placeholder="Value" className="border rounded px-1 py-1 w-28"/>
            <input type="text" name="category" placeholder="Category" className="border rounded px-1 py-1 w-28"/>
            <input type="text" name="items" placeholder="Items" className="border rounded px-1 py-1 w-28"/>
            <input type="text" name="notes" placeholder="Notes" className="border rounded px-1 py-1 w-36"/>
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}