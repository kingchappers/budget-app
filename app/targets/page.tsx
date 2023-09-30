import { updateTargetAction } from "../_targetActions";
import { calculateTotal, caculateDifference } from "../components/target-calculation-functions";
import TargetFormServerComponent from "../components/target-form-server";
import { TargetFilter, getTargets } from "../lib/target-db";
import { revalidatePath } from 'next/cache'

export default async function Home() {
    let ExpenseFilter: TargetFilter = {
        limit: 50,
        type: "expense"
    }

    let IncomeFilter: TargetFilter = {
        limit: 50,
        type: "income"
    }
    
    let { targets: expenseTargets, results: expenseResults } = await getTargets(ExpenseFilter)
    let { targets: incomeTargets, results: incomeResults } = await getTargets(IncomeFilter)

    const monthlyExpenseTotal = calculateTotal(expenseTargets)
    const monthlyIncomeTotal = calculateTotal(incomeTargets)
    const impliedMonthlySaving = caculateDifference(monthlyExpenseTotal, monthlyIncomeTotal)

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

    // function targetCalculations(expenseTargets: TargetClass, incomeTargets: number){
    //     const monthlyExpenseTotal = calculateTotal(expenseTargets)
    //     const monthlyIncomeTotal = calculateTotal(incomeTargets)
    //     const impliedMonthlySaving = caculateDifference(monthlyExpenseTotal, monthlyIncomeTotal)

    //     return{monthlyExpenseTotal, monthlyIncomeTotal, impliedMonthlySaving}
    // }

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

            <h1 className="text-1xl font-bold mt-4 mb-4">Total Monthly Expense Target:</h1>
            <p>{monthlyExpenseTotal}</p>
            
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

            <h1 className="text-1xl font-bold mt-4 mb-4">Total Monthly Expense Target:</h1>
            <p>{monthlyIncomeTotal}</p>

            <h1>Monthly Budget Targets</h1>
            <p>Target Monthly Expenses: {monthlyExpenseTotal}</p>
            <p>Target Monthly Income:   {monthlyIncomeTotal}</p>
            <p>Target Monthly Savings:  {impliedMonthlySaving}</p>

        </div>
    );
}