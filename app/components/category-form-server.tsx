import { createCategoryAction } from "../_categoryActions";

export default function IncomeForm() {
    async function action(data: FormData) {
        "use server";

        const label = data.get("label");
        if (!label || typeof label !== "string"){
            return;
        }

        const transactionCategory = data.get("transactionCategory");
        if (!transactionCategory || typeof transactionCategory !== "boolean"){
            return;
        }
        
        const incomeCategory = data.get("incomeCategory");
        if (!incomeCategory || typeof incomeCategory !== "boolean"){
            return;
        }

        //For testing / Troubleshooting
        // console.log(typeof value)

        // Invoke server action to add new transaction
        await createCategoryAction({ label, transactionCategory, incomeCategory, path: "/" }); 
    }

    return(      

        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <input type="text" name="label" placeholder="Category" className="border rounded px-1 py-1 w-52"/>
            <input type="checkbox" checked={true} name="transactionCategory" className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"/>
            <input type="checkbox" checked={true} name="incomeCategory" className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"/>
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}