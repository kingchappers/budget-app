import TransactionFormServerComponent from "../components/transaction-form-server";
import TransactionItemServerComponent from "../components/transaction-item-server";
import { getTransactions } from "../lib/transaction-db";

export default async function Home() {
    const { transactions, results } = await getTransactions();

    return(
        <div className="container mx-auto max-w-md p-4">

            <TransactionFormServerComponent />

            <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
            <table className="divide-y-2 table-auto">
                <thead className="table-header-group">
                    <tr className="table-row text-left text-1xl">
                        <th className="px-5">Date</th>
                        <th className="px-5">Vendor</th>
                        <th className="px-5">Value</th>
                        <th className="px-5">Category</th>
                        <th className="px-5">Items</th>
                        <th>Notes</th>
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