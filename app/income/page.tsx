import IncomeFormServerComponent from "../components/income-form-server";
import IncomeItemServerComponent from "../components/income-item-server";
import { getIncomes } from "../lib/income-db";
import { getCategories, CategoryFilter } from "../lib/categories-db";
import { CategoriesComboProps } from "../components/comboBox";

export default async function Home() {
    const filter: CategoryFilter = {
        limit: 30,
        type: "income"
    }

    const { incomes, results } = await getIncomes();
    let categories: CategoriesComboProps = await getCategories(filter) as CategoriesComboProps;
    const listOfCategories = categories.categories

    return(
        <div className="container mx-auto max-w-screen-2xl p-4">

            <IncomeFormServerComponent categories={listOfCategories}/>

            <h1 className="text-2xl font-bold mb-4">Income List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="px-5 w-10">Date</th>
                        <th className="px-5 w-52">Company</th>
                        <th className="px-5 w-24">Amount</th>
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