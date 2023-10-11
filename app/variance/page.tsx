import { updateTargetAction } from "../_targetActions";
import { calculateTargetsTotal, calculateDifference, calculateIncomeTotal, calculateTransactionTotal } from "../components/target-calculation-functions";
import TargetFormServerComponent from "../components/target-form-server";
import { TargetFilter, getTargets } from "../lib/target-db";
import { revalidatePath } from 'next/cache'
import { getTransactionsBetweenDates } from "../lib/transaction-db";
import { getIncomesBetweenDates } from "../lib/income-db";
import VarianceTimeButton from "../components/variance-button-group"

export default async function Home() {
    const transactionFilter = {}
    const incomeFilter = {}

    const targetExpenseFilter: TargetFilter = {
        limit: 50,
        type: "expense"
    }

    const targetIncomeFilter: TargetFilter = {
        limit: 50,
        type: "income"
    }

    let { targets: expenseTargets, results: expenseResults } = await getTargets(targetExpenseFilter)
    let { targets: incomeTargets, results: incomeResults } = await getTargets(targetIncomeFilter)

    const targetMonthlyExpenseTotal = calculateTargetsTotal(expenseTargets)
    const targetMonthlyIncomeTotal = calculateTargetsTotal(incomeTargets)
    const impliedMonthlySaving = calculateDifference(targetMonthlyExpenseTotal, targetMonthlyIncomeTotal)

    const { transactions: monthTransactions } = await getTransactionsBetweenDates()
    const { incomes: monthIncomes } = await getIncomesBetweenDates(incomeFilter)

    const actualMonthyExpensesTotal = calculateTransactionTotal(monthTransactions)
    const actualMonthlyIncomeTotal = calculateIncomeTotal(monthIncomes)
    const actualMonthlySaving = calculateDifference(actualMonthyExpensesTotal, actualMonthlyIncomeTotal)

    const expenseDifference = calculateDifference(actualMonthyExpensesTotal, targetMonthlyExpenseTotal)
    const incomeDifference = calculateDifference(targetMonthlyIncomeTotal, actualMonthlyIncomeTotal)
    const savingDifference = calculateDifference(impliedMonthlySaving, actualMonthlySaving)

    const expenseDifferenceColor = textColourClass(expenseDifference)
    const incomeDifferenceColor = textColourClass(incomeDifference)
    const savingDifferenceColor = textColourClass(savingDifference)

    async function action(data: FormData) {
        "use server"

        data.forEach((value, key) => {
            if (!value || typeof Number(value) !== "number") {
                return;
            }

            updateTargetAction(key, { targetAmount: Number(value) }, "/with-server-actions")
        });

        //This will refresh the page when a target is set to update the calculated variables.
        revalidatePath('/')
    }

    function textColourClass(value: number) {
        if (value > 0) {
            return "text-center text-green-500"
        } else if (value < 0) {
            return "text-center text-red-500"
        } else {
            return "text-center"
        }
    }

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold my-4">Spending Targets vs Actuals</h1>

            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-10"></th>
                        <th className="pl-5 text-center w-44">Target</th>
                        <th className="px-5 text-center w-44">Actual Spending</th>
                        <th className="px-5 text-center w-44">Difference</th>
                    </tr>
                </thead>
                <tr className="">
                    <td className="text-right font-bold">Expenses:</td>
                    <td className="text-center">£{targetMonthlyExpenseTotal.toFixed(2)}</td>
                    <td className="text-center">£{actualMonthyExpensesTotal.toFixed(2)}</td>
                    <td className={expenseDifferenceColor}>£{expenseDifference.toFixed(2)}</td>
                </tr>
                <tr className="">
                    <td className="text-right font-bold">Income:</td>
                    <td className="text-center">£{targetMonthlyIncomeTotal.toFixed(2)}</td>
                    <td className="text-center">£{actualMonthlyIncomeTotal.toFixed(2)}</td>
                    <td className={incomeDifferenceColor}>£{incomeDifference.toFixed(2)}</td>
                </tr>
                <tr className="">
                    <td className="text-right font-bold">Savings:</td>
                    <td className="text-center">£{impliedMonthlySaving.toFixed(2)}</td>
                    <td className="text-center">£{actualMonthlySaving.toFixed(2)}</td>
                    <td className={savingDifferenceColor}>£{savingDifference.toFixed(2)}</td>
                </tr>
            </table>

            <VarianceTimeButton />

        </div>
    );
}
