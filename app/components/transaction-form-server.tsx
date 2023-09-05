import { createTransactionAction } from "../_actions";

export default function TransactionForm() {
    async function action(data: FormData) {
        "use server";

        const transactionDate = data.get("transactionDate");
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
        if (!items || typeof items !== "string"){
            return;
        }

        const notes = data.get("notes");
        if (!notes || typeof notes !== "string"){
            return;
        }

        //For testing / Troubleshooting
        // console.log(typeof value)

        // Invoke server action to add new transaction
        await createTransactionAction({ transactionDate, vendor, value, category, items, notes, path: "/" }); 
    }

    return(
        <form action={action} key={Math.random()} className="flex items-center space-x-2 mb-4">
            <input type="text" name="transactionDate" className="border rounded px-1 py-1 flex-1"/>
            <input type="text" name="vendor" className="border rounded px-1 py-1 flex-1"/>
            <input type="number" name="value" className="border rounded px-1 py-1 flex-1"/>
            <input type="text" name="category" className="border rounded px-1 py-1 flex-1"/>
            <input type="text" name="items" className="border rounded px-1 py-1 flex-1"/>
            <input type="text" name="notes" className="border rounded px-1 py-1 flex-1"/>
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}