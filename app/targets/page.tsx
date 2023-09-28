import { updateTargetAction } from "../_targetActions";
import TargetFormServerComponent from "../components/target-form-server";
import { TargetFilter, getTargets } from "../lib/target-db";

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

    async function action(data: FormData){
        "use server"

        data.forEach((value, key) => {
            if(!value || typeof Number(value) !== "number"){
                return;
            }
            
            updateTargetAction(key, {targetAmount: Number(value)}, "/with-server-actions")
        });
    }

    return(
        <div className="container mx-auto max-w-screen-2xl p-4"> 

            <h1 className="text-2xl font-bold mb-4">Expense Targets</h1>
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
            
            <h1 className="text-2xl font-bold mt-5 mb-3">Income Targets</h1>
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

        </div>
    );
}