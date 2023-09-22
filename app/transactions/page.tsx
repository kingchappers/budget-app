import TransactionFormServerComponent from "../components/transaction-form-server";
import TransactionItemServerComponent from "../components/transaction-item-server";
import { getTransactions } from "../lib/transaction-db";
import { getCategories, CategoryFilter } from "../lib/categories-db";
import { CategoriesComboProps } from "../components/comboBox";

export default async function Home() {
    const filter: CategoryFilter = {
        limit: 30,
        type: "transaction"
    }

    const { transactions, results } = await getTransactions();
    let categories: CategoriesComboProps = await getCategories(filter) as CategoriesComboProps;
    const listOfCategories = categories.categories

    return(
        <div className="container mx-auto max-w-screen-2xl p-4">

            <TransactionFormServerComponent categories={listOfCategories}/>

            <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="px-5 w-10">Date</th>
                        <th className="px-5 w-52">Vendor</th>
                        <th className="px-5 w-20">Value</th>
                        <th className="px-5 w-48">Category</th>
                        <th className="px-5 w-48">Items</th>
                        <th className="px-5 w-80">Notes</th>
                    </tr>
                </thead>       

            {results === 0 ? (
                <p className="text-center">No Transactions Found</p>
            ) : (
                transactions?.map((transaction) => (
                    <TransactionItemServerComponent key={transaction.id} transaction={transaction} />
                ))
            )}

            </table>
        </div>
        
    );
}