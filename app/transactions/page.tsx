import TransactionFormServerComponent from "../components/transaction-form-server";
import TransactionItemServerComponent from "../components/transaction-item-server";
import { TransactionFilter, getTransactions } from "../lib/transaction-db";
import { getCategories, CategoryFilter } from "../lib/categories-db";
import { CategoriesComboProps } from "../components/comboBox";
import Link from "next/link";
import clsx from "clsx";

export default async function Home({
    searchParams
}:{
    searchParams: { [key: string]: string | string[] | undefined }
}) 
{
    let transactionFilter: TransactionFilter = {
        page: 1,
        limit: 10
    }
    
    const categoryFilter: CategoryFilter = {
        limit: 30,
        type: "transaction"
    }

    // __________________________________________________________________________________________________________________
    // __________________________________________________________________________________________________________________
     
    let paginatedTransactionFilter: TransactionFilter = {
        page: typeof searchParams.page === 'string' ? Number(searchParams.page) : 1 ?? 1,
        limit: typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 10 ?? 10
    }

    // __________________________________________________________________________________________________________________
    // __________________________________________________________________________________________________________________

    const { transactions, results, maxPages } = await getTransactions(paginatedTransactionFilter);
    // console.log(maxPages)
    
    let categories: CategoriesComboProps = await getCategories(categoryFilter) as CategoriesComboProps;
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
            
            
            <Link href={`/transactionsPagination?page=${paginatedTransactionFilter.page > 1 ? paginatedTransactionFilter.page - 1 : 1}`} className={clsx('rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800',
                paginatedTransactionFilter.page <= 1 && 'pointer-events-none opacity-50')}>Previous</Link>
            <Link href={`/transactionsPagination?page=${paginatedTransactionFilter.page < maxPages ? paginatedTransactionFilter.page + 1 : maxPages}`} className={clsx('rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800',
                paginatedTransactionFilter.page >= maxPages && 'pointer-events-none opacity-50')}>Next</Link>
        </div>
        
    );
}