import { TransactionForm } from "../components/transaction-form-server";
import { TransactionItem } from "../components/transaction-item-server";
import { TransactionFilter, getTransactions } from "../lib/transaction-db";
import { getCategories, CategoryFilter } from "../lib/categories-db";
import { CategoriesComboProps } from "../components/comboBox";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export default async function Transactions({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;

    const categoryFilter: CategoryFilter = {
        limit: 30,
        type: "transaction",
        userId: userId,
    }

    let tansactionFilter: TransactionFilter = {
        page: typeof searchParams.page === 'string' ? Number(searchParams.page) : 1,
        limit: typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 50,
        userId: userId,
    }

    let { transactions, results, maxPages } = await getTransactions(tansactionFilter);
    let categories: CategoriesComboProps = await getCategories(categoryFilter) as CategoriesComboProps;
    const listOfCategories = categories.categories;

    if (maxPages == undefined) {
        maxPages = 1;
    }

    if (tansactionFilter.page == undefined) {
        tansactionFilter.page = 1;
    }

    if (tansactionFilter.limit == undefined) {
        tansactionFilter.limit = 50;
    }

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <TransactionForm categories={listOfCategories} userId={userId} />

            <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left">
                        <th className="px-3 lg:px-5 w-5 lg:w-20">Date</th>
                        <th className="px-3 lg:px-5 w-24 lg:w-44">Vendor</th>
                        <th className="px-3 lg:px-5 w-20">Value</th>
                        <th className="px-3 lg:px-5 lg:w-48">Category</th>
                        <th className="px-3 lg:px-5 lg:w-48">Items</th>
                        <th className="px-3 lg:px-5 lg:w-80">Notes</th>
                        <th className="px-3 lg:px-5 lg:w-5"></th>
                    </tr>
                </thead>

                {results === 0 ? (
                    <tbody>
                        <td colSpan={7} className="text-center">No Transactions Found</td>
                    </tbody>
                ) : (
                    transactions?.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} categories={listOfCategories}/>
                    ))
                )}

                <tr>
                    <td className="pt-4"><Link href={`/transactions?page=${tansactionFilter.page > 1 ? tansactionFilter.page - 1 : 1}`} className={clsx('rounded border bg-sky-500 px-3 p-1', tansactionFilter.page <= 1 && 'pointer-events-none opacity-50')}>Previous</Link></td>
                    <td colSpan={5}></td>
                    <td className="pt-4"><Link href={`/transactions?page=${tansactionFilter.page < maxPages ? tansactionFilter.page + 1 : maxPages}`} className={clsx('rounded border bg-sky-500 px-3.5 py-1 float-right', tansactionFilter.page >= maxPages && 'pointer-events-none opacity-50')}>Next</Link></td>
                </tr>
            </table>



        </div>

    );
}