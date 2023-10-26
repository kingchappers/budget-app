import { createCategoryAction } from "../_categoryActions";
import { createTargetAction } from "../_targetActions";

interface CategoryFormProps {
    userId: string;
}

export function CategoryForm({ userId }: CategoryFormProps) {
    async function action(data: FormData) {
        "use server";

        const label = data.get("label");
        if (!label || typeof label !== "string") {
            return;
        }

        const transactionCategoryCheck = data.get("transactionCategoryCheck");
        var transactionCategory = true
        if (transactionCategoryCheck == "on") {
            transactionCategory = true
        } else {
            transactionCategory = false
        }

        const incomeCategoryCheck = data.get("incomeCategoryCheck");
        var incomeCategory = true
        if (incomeCategoryCheck == "on") {
            incomeCategory = true;
        } else {
            incomeCategory = false;
        }

        // Invoke server action to add new category
        await createCategoryAction({ label, transactionCategory, incomeCategory, userId, path: "/" });

        // Invoke server action to add new target
        await createTargetAction({ categoryName: label, targetAmount: 0, expenseTarget: transactionCategory, path: "/" })
        if (incomeCategory == true && transactionCategory == true) {
            await createTargetAction({ categoryName: label, targetAmount: 0, expenseTarget: false, path: "/" })
        }
    }

    return (

        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <input type="text" name="label" placeholder="Category" className="border rounded px-1 py-1 w-52" />
            <input type="checkbox" name="transactionCategoryCheck" id="transactionCategoryCheck" className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed" defaultChecked />
            <label htmlFor="transactionCategoryCheck">Transaction Category</label>
            <input type="checkbox" name="incomeCategoryCheck" id="incomeCategoryCheck" className="h-6 w-6 border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed" defaultChecked />
            <label htmlFor="incomeCategoryCheck">Income Category</label>
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}