import { createTransactionAction } from "../_transactionActions";
import { DatePicker } from "./datePicker";
import { CategoryComboBox } from "./comboBox";
import { CategoryClass } from "../models/Category";
import { FormAddButton } from "./form-submit-buttons";
import { startOfMonth } from "date-fns";
import { stringToDate } from "../lib/utils";
import { getMonthlySpendByMonthAction, updateMonthlySpendAction } from "../_monthlySpendActions";
import { monthCategoryTotal } from "../models/MonthlySpend";

interface TransactionFormProps {
    categories: CategoryClass[];
    userId: string;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function TransactionForm({ categories, userId }: TransactionFormProps) {
    async function action(data: FormData) {
        "use server";

        const transactionDate = data.get("pickedDate");
        if (!transactionDate || typeof transactionDate !== "string") {
            return;
        }

        const vendor = data.get("vendor");
        if (!vendor || typeof vendor !== "string") {
            return;
        }

        const value = Number(data.get("value"));
        if (!value || typeof value !== "number") {
            return;
        }

        const category = data.get("categoryCombobox");
        if (!category || typeof category !== "string") {
            return;
        }

        const items = data.get("items");
        if (typeof items !== "string") {
            return;
        }

        const notes = data.get("notes");
        if (typeof notes !== "string") {
            return;
        }

        // Invoke server action to add new transaction
        await createTransactionAction({ transactionDate, vendor, value, category, items, notes, userId, path: "/" });

        console.log("_________________________________________________________________________________________________________________________________________________________________________")
        console.log(transactionDate)
        console.log("_________________________________________________________________________________________________________________________________________________________________________")
        const transactionDateMonthStart = startOfMonth(stringToDate(transactionDate))

        const { monthlySpend } = await getMonthlySpendByMonthAction({ month: transactionDateMonthStart, userId })
        // console.log(monthlySpend)

        if (monthlySpend) {
            var monthlySpendUpdate: {
                monthTotal: number,
                monthCategoryTotals: monthCategoryTotal[]
            }

            monthlySpend.monthCategoryTotals.forEach(async (monthCategoryTotal) => {
                console.log("_________________________________________________________________________________________________________________________________________________________________________")
                console.log("Current Version:")
                console.log("_________________________________________________________________________________________________________________________________________________________________________")
                console.log(monthlySpend)

                // console.log("Monthly Spend Total Before update: " + monthlySpend.monthTotal)
                monthlySpend.monthTotal = monthlySpend.monthTotal + value
                // console.log("Monthly Spend Total After Update: " + monthlySpend.monthTotal)

                if (monthCategoryTotal.categoryName == category) {
                    // console.log("Category match!")
                    // console.log(monthCategoryTotal)

                    // console.log(monthCategoryTotal.categoryName)
                    monthCategoryTotal.value = monthCategoryTotal.value + value
                    monthCategoryTotal.percentage = (monthCategoryTotal.value / monthlySpend.monthTotal) * 100
                    monthCategoryTotal.chartTitle = `:\n£${monthCategoryTotal.value} | ${((monthCategoryTotal.value / monthlySpend.monthTotal) * 100).toFixed(2)}%`
                    // console.log(monthCategoryTotal)


                    // await updateMonthlySpendAction(monthlySpend.id, { monthlySpendUpdate }, "/")

                } else {
                    // Logic for creating a new entry for monthlyCategoryTotals - updating the database
                }




            })

            monthlySpendUpdate = {
                monthTotal: monthlySpend.monthTotal,
                monthCategoryTotals: monthlySpend.monthCategoryTotals
            }
            
            console.log("_________________________________________________________________________________________________________________________________________________________________________")
                console.log("Updated Version:")
                console.log("_________________________________________________________________________________________________________________________________________________________________________")
                // console.log(monthlySpend)
                console.log(monthlySpendUpdate)

                await updateMonthlySpendAction(monthlySpend.id, monthlySpendUpdate, "/")
        }
    }

    return (

        <form autoComplete="off" action={action} key={Math.random()} className="flex flex-wrap items-center space-x-1 lg:space-x-3 mb-4">
            <DatePicker />
            <input type="text" name="vendor" placeholder="Vendor" className="border rounded px-1 py-1 w-24 lg:w-40" />
            <input type="number" step="any" name="value" placeholder="Value" className="border rounded px-1 py-1 w-16 lg:w-20" />
            <CategoryComboBox categories={categories} />
            <input type="text" name="items" placeholder="Items" className="border rounded px-1 py-1 w-24 lg:w-44" />
            <input type="text" name="notes" placeholder="Notes" className="border rounded px-1 py-1 w-24 lg:w-80" />
            <FormAddButton />
        </form>
    );
}