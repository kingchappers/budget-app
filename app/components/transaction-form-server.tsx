import { createTransactionAction } from "../_transactionActions";
import { DatePicker } from "./datePicker";
import { CategoryComboBox } from "./comboBox";
import { CategoryClass } from "../models/Category";
import { FormAddButton } from "./form-submit-buttons";
import { startOfMonth } from "date-fns";
import { stringToDate } from "../lib/utils";
import { getMonthlySpendByMonthAction } from "../_monthlySpendActions";

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

        if(monthlySpend){
            monthlySpend.monthCategoryTotals.forEach((monthCategoryTotal) => {
                console.log(monthCategoryTotal.categoryName)

                console.log("Monthly Spend Total Before update: " + monthlySpend.monthTotal)
                const monthTotalUpdate = monthlySpend.monthTotal + value
                console.log("Monthly Spend Total After Update: " + monthTotalUpdate)

                if(monthCategoryTotal.categoryName == category){
                    console.log("Category match!")
                    console.log(monthCategoryTotal)



                    const monthlySpendUpdate = {
                        monthTotal: monthTotalUpdate,
                        monthCategoryTotals: []
                    }







                    // EXAMPLE monthCategoryTotal OBJECT FOR REFERENCE
                    // {
                    //     chartTitle: 'boogey:\n£4 | 14.81%',
                    //     categoryName: 'boogey',
                    //     value: 4,
                    //     percentage: 14.814814814814813
                    //   }





                    //GENERATING THE VALUES BELOW

                    // const monthTotal = calculateTransactionTotal(transactions);
                    // const categorySpendData: categoryData[] = Object.entries(categorySpendRecord).map(([category, value]) => ({
                    //        chartTitle: category + `:\n£${value} | ${((value / monthTotal) * 100).toFixed(2)}%`,
                    //        categoryName: category,
                    //        value: value,
                    //        percentage: ((value / monthTotal) * 100),
                    //    }))



                    // Full object for reference
                    // {
                    //     _id: new ObjectId('65ff3be396f195a2effd627f'),
                    //     month: 2024-03-01T00:00:00.000Z,
                    //     monthTotal: 27,
                    //     monthCategoryTotals: [
                    //       {
                    //         chartTitle: 'boogey:\n£4 | 14.81%',
                    //         categoryName: 'boogey',
                    //         value: 4,
                    //         percentage: 14.814814814814813
                    //       },
                    //       {
                    //         chartTitle: 'test:\n£23 | 85.19%',
                    //         categoryName: 'test',
                    //         value: 23,
                    //         percentage: 85.18518518518519
                    //       }
                    //     ],
                    //     userId: '65391927de5c11a3e686c2f7',
                    //     createdAt: 2024-03-23T20:30:27.970Z,
                    //     updatedAt: 2024-03-23T20:30:27.970Z,
                    //     __v: 0
                    //   }

                } else {
                    // Logic for creating a new entry for monthlyCategoryTotals - updating the database
                }
            })
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