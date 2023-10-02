import { updateTargetAction } from "../_targetActions";
import { calculateTotal, caculateDifference } from "../components/target-calculation-functions";
import TargetFormServerComponent from "../components/target-form-server";
import { TargetFilter, getTargets } from "../lib/target-db";
import { revalidatePath } from 'next/cache'
import { getTransactionsBetweenDates } from "../lib/transaction-db";
import { getIncomesBetweenDates } from "../lib/income-db";

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

    const targetMonthlyExpenseTotal = calculateTotal(expenseTargets)
    const targetMonthlyIncomeTotal = calculateTotal(incomeTargets)
    const targetImpliedMonthlySaving = caculateDifference(targetMonthlyExpenseTotal, targetMonthlyIncomeTotal)

    const { transactions: monthTransactions } = await getTransactionsBetweenDates(transactionFilter)
    //console.log(monthTransactions)
    const { incomes: monthIncomes } = await getIncomesBetweenDates(incomeFilter)
    console.log(monthIncomes)

    async function action(data: FormData){
        "use server"

        data.forEach((value, key) => {
            if(!value || typeof Number(value) !== "number"){
                return;
            }
            
            updateTargetAction(key, {targetAmount: Number(value)}, "/with-server-actions")
        });

        //This will refresh the page when a target is set to update the calculated variables.
        revalidatePath('/')
    }

    return(
        <div className="container mx-auto max-w-screen-2xl p-4"> 

            <h1 className="text-2xl font-bold mb-4">Monthly Expense Targets</h1>
            <form action={action} key={Math.random()} >
                <div className="grid grid-cols-3">
                    {expenseResults === 0 ? (
                        <p className="text-center">No Expense Targets Found</p>
                    ) : (
                        expenseTargets?.map((expenseTarget) => (
                            <TargetFormServerComponent key={expenseTarget.id} target={expenseTarget} />
                        ))
                    )}
                </div>
                <button className="mt-5 ml-10 px-4 py-1 text-white rounded bg-green-500">Save</button>
            </form>
            
            <h1 className="text-2xl font-bold mt-5 mb-3">Monthly Income Targets</h1>
            <form action={action} key={Math.random()}>
                <div className="grid grid-cols-1">
                    {incomeResults === 0 ? (
                        <p className="text-center">No Income Targets Found</p>
                    ) : (
                        incomeTargets?.map((incomeTarget) => (
                            <TargetFormServerComponent key={incomeTarget.id} target={incomeTarget} />
                        ))
                    )}
            </div>
                <button className="mt-5 ml-10 px-4 py-1 text-white rounded bg-green-500">Save</button>
            </form>

            <h1 className="text-2xl font-bold my-4">Monthly Budget Targets</h1>

            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-10"></th>
                        <th className="pl-5 text-center w-44">Monthly Targets</th>
                        <th className="px-5 text-center w-44">Actual Data</th>
                    </tr>
                </thead>  
                <tr className="">
                    <td className="text-right font-bold">Expenses:</td>
                    <td className="text-center">{targetMonthlyExpenseTotal}</td>
                    <td className="text-center">Add functionality</td>
                </tr>
                <tr className="">
                    <td className="text-right font-bold">Income:</td>
                    <td className="text-center">{targetMonthlyIncomeTotal}</td>
                    <td className="text-center">Add functionality</td>
                </tr>
                <tr className="">
                    <td className="text-right font-bold">Savings:</td>
                    <td className="text-center">{targetImpliedMonthlySaving}</td>
                    <td className="text-center">Add functionality</td>
                </tr>
            </table>

        </div>
    );
}