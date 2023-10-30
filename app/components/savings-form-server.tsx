import { createInitialSavingAction } from "../_savingActions";

interface SavingFormProps {
    userId: string;
}

export function SavingForm({ userId }: SavingFormProps) {
    async function action(data: FormData) {
        "use server";

        const value = Number(data.get("initialSavings"));
        if (!value || typeof value !== "number") {
            return;
        }

        // Invoke server action to add the initial user saving
        await createInitialSavingAction({ value, userId, path: "/" });
    }

    return (

        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <input type="number" step="any" name="initialSavings" placeholder="Initial Savings Amount" className="border rounded px-1 py-1 w-48" />
            <button className="px-4 py-1 text-white rounded bg-green-500">Save Initial Savings</button>
        </form>
    );
}