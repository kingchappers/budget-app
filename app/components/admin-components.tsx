import { createCategoryAction } from "../_categoryActions";
import { createTargetAction } from "../_targetActions";
import { userProps } from "./user-components";

export function DefaultCategoriesButton({ userId }: userProps) {
    async function action() {
        "use server";

        interface Category {
            label: string;
            transactionCategory: boolean;
            incomeCategory: boolean;
        }

        const defaultCategories: Category[] = [
            {
                label: "Car Maintenance",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Car Payment",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Childcare",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Clothing",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Debt Repayment",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Electronics",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Entertainment",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Hobbies",
                transactionCategory: true,
                incomeCategory: true,
            },
            {
                label: "Fuel",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Gifts",
                transactionCategory: true,
                incomeCategory: true,
            },
            {
                label: "Going Out",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Groceries",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Fitness",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Home Maitenance",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Home Improvement",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Insurance",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Medical",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Mortgage",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Public Transport",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Rent",
                transactionCategory: true,
                incomeCategory: true,
            },
            {
                label: "Restaurant",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Telecom",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Travel/Holiday",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Utilities",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Job",
                transactionCategory: true,
                incomeCategory: true,
            },
            {
                label: "Council Tax",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Pets",
                transactionCategory: true,
                incomeCategory: false,
            },
            {
                label: "Side Project",
                transactionCategory: false,
                incomeCategory: true,
            },
            {
                label: "Refund",
                transactionCategory: false,
                incomeCategory: true,
            },
            {
                label: "Expense Reimbursement",
                transactionCategory: false,
                incomeCategory: true,
            }
        ]

        defaultCategories.forEach(async (category) => {
            const label = category.label
            const transactionCategory = category.transactionCategory
            const incomeCategory = category.incomeCategory
            await createCategoryAction({ label, transactionCategory, incomeCategory, userId, path: "/" });
            await createTargetAction({ categoryName: label, targetAmount: 0, expenseTarget: transactionCategory, path: "/" })
            if (category.incomeCategory == true && category.transactionCategory == true) {
                await createTargetAction({ categoryName: label, targetAmount: 0, expenseTarget: false, path: "/" })
            }
        });
    }

    return (
        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <button className="px-4 py-1 text-white rounded bg-green-500">Create Default Categories</button>
        </form>
    );
}