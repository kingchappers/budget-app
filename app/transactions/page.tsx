import TransactionFormServerComponent from "@/app/components/transaction-form-server";
import TransactionItemServerComponent from "../components/transaction-item-server";
import { getTransactions } from "../lib/transaction-db";

export default async function Home() {
    const { transactions, results } = await getTransactions();

    return(
        <div className="container mx-auto max-w-md p-4">
            <TransactionFormServerComponent />
            <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
            {results === 0 ? (
                <p className="text-center">No Transactions Found</p>
            ) : (
                transactions?.map((transaction) => (
                    <TransactionItemServerComponent key={transaction.id} transaction={transaction} />
                ))
            )}
        </div>
    );
}