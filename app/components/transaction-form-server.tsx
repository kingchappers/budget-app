import { type } from "os";
import { createTransactionAction } from "../_actions";




export default function TransactionForm() {
    async function action(data: FormData) {
        "use server";
        
        const transactionDate = data.get("transactionDate");
        if (!transactionDate || typeof transactionDate !== "string"){
            return;
        }

        const transactionVendor = data.get("transactionVendor");
        if (!transactionVendor || typeof transactionVendor !== "string"){
            return;
        }

        const transactionValue = data.get("transactionValue");
        if (!transactionValue || typeof transactionValue !== "number"){
            return;
        }
        
        const transactionCategory = data.get("transactionCategory");
        if (!transactionCategory || typeof transactionCategory !== "string"){
            return;
        }

        const transactionItems = data.get("transactionItems");
        if (!transactionItems || typeof transactionItems !== "string"){
            return;
        }

        const transcationNotes = data.get("transcationNotes");
        if (!transcationNotes || typeof transcationNotes !== "string"){
            return;
        }

        // Invoke server action to add new transaction
        await createTransactionAction({ transactionDate, transactionVendor, transactionValue, transactionCategory, transactionItems, transcationNotes, path: "/"});
    }

    return(
        <form action={action} key={Math.random()} className="flex items-center space-x-2 mb-4">
            <input type="text" name="transactionDate" className="border rounded px-2 py-1 flex-1"/>
            <input type="text" name="transactionVendor" className="border rounded px-2 py-1 flex-1"/>
            <input type="number" name="transactionValue" className="border rounded px-2 py-1 flex-1"/>
            <input type="text" name="transactionCategory" className="border rounded px-2 py-1 flex-1"/>
            <input type="text" name="transactionItems" className="border rounded px-2 py-1 flex-1"/>
            <input type="text" name="transcationNotes" className="border rounded px-2 py-1 flex-1"/>
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}