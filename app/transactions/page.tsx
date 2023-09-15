import TransactionFormServerComponent from "../components/transaction-form-server";
import TransactionItemServerComponent from "../components/transaction-item-server";
import { getTransactions } from "../lib/transaction-db";

export default async function Home() {
    const { transactions, results } = await getTransactions();

    return(
        <div className="container mx-auto max-w-screen-2xl p-4">

            <TransactionFormServerComponent />

            <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="px-5 w-10">Date</th>
                        <th className="px-5 w-72">Vendor</th>
                        <th className="px-5 w-10">Value</th>
                        <th className="px-5 w-48">Category</th>
                        <th className="px-5 w-48">Items</th>
                        <th className="w-80">Notes</th>
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