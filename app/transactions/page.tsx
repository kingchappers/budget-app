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
    const categoryFilter: CategoryFilter = {
        limit: 30,
        type: "transaction"
    }
    
    let paginatedTransactionFilter: TransactionFilter = {
        page: typeof searchParams.page === 'string' ? Number(searchParams.page) : 1,
        limit: typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 50
    }

    let { transactions, results, maxPages } = await getTransactions(paginatedTransactionFilter);
    let categories: CategoriesComboProps = await getCategories(categoryFilter) as CategoriesComboProps;
    const listOfCategories = categories.categories

    if(maxPages == undefined){
        maxPages = 1
    }

    if (paginatedTransactionFilter.page == undefined){
        paginatedTransactionFilter.page = 1
    }

    if (paginatedTransactionFilter.limit == undefined){
        paginatedTransactionFilter.limit = 50
    }

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

                <tr>
                    <td className="pt-4"><Link href={`/transactions?page=${paginatedTransactionFilter.page > 1 ? paginatedTransactionFilter.page - 1 : 1}`} className={clsx('rounded border bg-sky-500 px-3 p-1', paginatedTransactionFilter.page <= 1 && 'pointer-events-none opacity-50')}>Previous</Link></td>
                    <td colSpan={5}></td>
                    <td className="pt-4"><Link href={`/transactions?page=${paginatedTransactionFilter.page < maxPages ? paginatedTransactionFilter.page + 1 : maxPages}`} className={clsx('rounded border bg-sky-500 px-3.5 py-1 float-right',paginatedTransactionFilter.page >= maxPages && 'pointer-events-none opacity-50')}>Next</Link></td>
                </tr>
            </table>
            
            
            
        </div>
        
    );
}