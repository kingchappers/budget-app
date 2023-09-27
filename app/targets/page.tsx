import TargetFormServerComponent from "../components/target-form-server";
import { getTargets } from "../lib/target-db";

export default async function Home() {
    let { targets, results } = await getTargets()

    return(
        <div className="container mx-auto max-w-screen-2xl p-4">            
            <h1 className="text-2xl font-bold mb-4">Expense Targets</h1>

            {results === 0 ? (
                <p className="text-center">No Targets Found</p>
            ) : (
                targets?.map((target) => (
                    <TargetFormServerComponent key={target.id} target={target} />
                ))
            )}

            <h1 className="text-2xl font-bold mb-4">Income Targets</h1>

        </div>
        
    );
}