import { updateTargetAction } from "../_targetActions";
import TargetFormServerComponent from "../components/target-form-server";
import { TargetFilter, getTargets } from "../lib/target-db";

export default async function Home() {
    let filter: TargetFilter = {
        limit: 50
    }
    
    let { targets, results } = await getTargets(filter)

    async function action(data: FormData){
        "use server"

        data.forEach((value, key) => (
            updateTargetAction(key, {targetAmount: Number(value)}, "/with-server-actions")
        ));
    }

    return(
        <div className="container mx-auto max-w-screen-2xl p-4">            
            <h1 className="text-2xl font-bold mb-4">Expense Targets</h1>

            <form action={action} key={Math.random()} className="items-center space-x-3 mb-4">
                {results === 0 ? (
                    <p className="text-center">No Targets Found</p>
                ) : (
                    targets?.map((target) => (
                            <TargetFormServerComponent key={target.id} target={target} />
                    ))
                )}
                
                <button className="px-4 py-1 text-white rounded bg-green-500">Save</button>
            </form>

            <h1 className="text-2xl font-bold mb-4">Income Targets</h1>

        </div>
        
    );
}