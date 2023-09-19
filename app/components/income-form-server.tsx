import { createIncomeAction } from "../_incomeActions";
import DatePicker from "./datePicker";

export default function IncomeForm() {
    async function action(data: FormData) {
        "use server";

        const incomeDate = data.get("pickedDate");
        if (!incomeDate || typeof incomeDate !== "string"){
            return;
        }

        const company = data.get("company");
        if (!company || typeof company !== "string"){
            return;
        }

        const ammount = Number(data.get("ammount"));
        if (!ammount || typeof ammount !== "number"){
            return;
        }
        
        const incomeCategory = data.get("incomeCategory");
        if (!incomeCategory || typeof incomeCategory !== "string"){
            return;
        }

        const notes = data.get("notes");
        if (typeof notes !== "string"){
            return;
        }

        //For testing / Troubleshooting
        // console.log(typeof value)

        // Invoke server action to add new transaction
        await createIncomeAction({ incomeDate, company, ammount, incomeCategory, notes, path: "/" }); 
    }

    return(      

        <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
            <DatePicker />
            <input type="text" name="company" placeholder="Company" className="border rounded px-1 py-1 w-52"/>
            <input type="number" name="ammount" placeholder="Ammount" className="border rounded px-1 py-1 w-20"/>
            <input type="text" name="incomeCategory" placeholder="Category" className="border rounded px-1 py-1 w-44"/>
            <input type="text" name="notes" placeholder="Notes" className="border rounded px-1 py-1 w-80"/>
            <button className="px-4 py-1 text-white rounded bg-green-500">Add</button>
        </form>
    );
}