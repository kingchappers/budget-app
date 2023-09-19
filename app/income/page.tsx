import IncomeFormServerComponent from "../components/income-form-server";
import IncomeItemServerComponent from "../components/income-item-server";
import { getIncomes } from "../lib/income-db";

export default async function Home() {
    const { incomes, results } = await getIncomes();

    return(
        <div className="container mx-auto max-w-screen-2xl p-4">

            <IncomeFormServerComponent />

            <h1 className="text-2xl font-bold mb-4">Income List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="px-5 w-10">Date</th>
                        <th className="px-5 w-52">Company</th>
                        <th className="px-5 w-20">Amount</th>
                        <th className="px-5 w-48">Category</th>
                        <th className="px-5 w-80">Notes</th>
                    </tr>
                </thead>       

            {results === 0 ? (
                <p className="text-center">No Incomes Found</p>
            ) : (
                incomes?.map((income) => (
                    <IncomeItemServerComponent key={income.id} income={income} />
                ))
            )}

            </table>
        </div>
        
    );
}