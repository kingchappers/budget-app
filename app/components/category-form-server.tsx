import { createCategoryAction } from "../_categoryActions";

export default function CategoryForm() {
    async function action(data: FormData) {
        "use server";

        const label = data.get("label");
        if (!label || typeof label !== "string"){
            return;
        }
        
        const transactionCategoryCheck = data.get("transactionCategoryCheck");
        var transactionCategory = true
        if (transactionCategoryCheck == "on"){
            transactionCategory = true
        } else {
            transactionCategory = false
        }
        
        const incomeCategoryCheck = data.get("incomeCategoryCheck");
        var incomeCategory = true
        if (incomeCategoryCheck == "on"){
            incomeCategory = true;
        } else {
            incomeCategory = false;
        }

        //For testing / Troubleshooting
        // console.log(typeof transactionCategory)
        // console.log(transactionCategory)
        // console.log(typeof incomeCategory)
        // console.log(incomeCategory)

        // Invoke server action to add new transaction
        await createCategoryAction({ label, transactionCategory, incomeCategory, path: "/" }); 
    }

    return(      

        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <input type="text" name="label" placeholder="Category" className="border rounded px-1 py-1 w-52"/>
            <input type="checkbox" name="transactionCategoryCheck" id="transactionCategoryCheck" className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed" defaultChecked/>
            <label htmlFor="transactionCategoryCheck">Transaction Category</label>
            <input type="checkbox" name="incomeCategoryCheck" id="incomeCategoryCheck" className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed" defaultChecked/>
            <label htmlFor="incomeCategoryCheck">Income Category</label>
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}