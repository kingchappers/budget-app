import { createCategoryAction } from "../_categoryActions";
import { createTargetAction } from "../_targetActions";

interface DefaultCategoriesButtonProps {
    userId: string,
}

export function DefaultCategoriesButton({ userId }: DefaultCategoriesButtonProps) {
    async function action() {
        "use server";

        interface Category {
            label: string;
            transactionCategory: boolean;
            incomeCategory: boolean;
            userId: string;
        }

        const defaultCategories: Category[] = [
            {
                label: "Car Maintenance",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Car Payment",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Childcare",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Clothing",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Debt Repayment",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Electronics",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Entertainment",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Hobbies",
                transactionCategory: true,
                incomeCategory: true,
                userId: userId,
            },
            {
                label: "Fuel",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Gifts",
                transactionCategory: true,
                incomeCategory: true,
                userId: userId,
            },
            {
                label: "Going Out",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Groceries",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Fitness",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Home Maitenance",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Home Improvement",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Insurance",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Medical",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Mortgage",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Public Transport",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Rent",
                transactionCategory: true,
                incomeCategory: true,
                userId: userId,
            },
            {
                label: "Restaurant",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Telecom",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Travel/Holiday",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Utilities",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Job",
                transactionCategory: true,
                incomeCategory: true,
                userId: userId,
            },
            {
                label: "Council Tax",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Pets",
                transactionCategory: true,
                incomeCategory: false,
                userId: userId,
            },
            {
                label: "Side Project",
                transactionCategory: false,
                incomeCategory: true,
                userId: userId,
            },
            {
                label: "Refund",
                transactionCategory: false,
                incomeCategory: true,
                userId: userId,
            },
            {
                label: "Expense Reimbursement",
                transactionCategory: false,
                incomeCategory: true,
                userId: userId,
            }
        ]

        defaultCategories.forEach(async (category) => {
            const label = category.label;
            const transactionCategory = category.transactionCategory;
            const incomeCategory = category.incomeCategory;
            const userId = category.userId;
            await createCategoryAction({ label, transactionCategory, incomeCategory, userId, path: "/" });
            await createTargetAction({ categoryName: label, targetAmount: 0, expenseTarget: transactionCategory, userId, path: "/" })
            if (category.incomeCategory == true && category.transactionCategory == true) {
                await createTargetAction({ categoryName: label, targetAmount: 0, expenseTarget: false, userId, path: "/" })
            }
        });
    }

    return (
        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <button className="px-4 py-1 text-white rounded bg-green-500">Create Default Categories</button>
        </form>
    );
}