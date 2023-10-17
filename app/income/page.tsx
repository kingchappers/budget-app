import { IncomeForm } from "../components/income-form-server";
import { IncomeItem } from "../components/income-item-server";
import { IncomeFilter, getIncomes } from "../lib/income-db";
import { getCategories, CategoryFilter } from "../lib/categories-db";
import { CategoriesComboProps } from "../components/comboBox";
import Link from "next/link";
import clsx from "clsx";

export default async function Home({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const filter: CategoryFilter = {
        limit: 30,
        type: "income"
    }

    let incomeFilter: IncomeFilter = {
        page: typeof searchParams.page === 'string' ? Number(searchParams.page) : 1,
        limit: typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 50
    }

    let { incomes, results, maxPages } = await getIncomes(incomeFilter);
    let categories: CategoriesComboProps = await getCategories(filter) as CategoriesComboProps;
    const listOfCategories = categories.categories


    if (maxPages == undefined) {
        maxPages = 1;
    }

    if (incomeFilter.page == undefined) {
        incomeFilter.page = 1;
    }

    if (incomeFilter.limit == undefined) {
        incomeFilter.limit = 50;
    }

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <IncomeForm categories={listOfCategories} />

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
                        <IncomeItem key={income.id} income={income} />
                    ))
                )}

                <tr>
                    <td className="pt-4"><Link href={`/income?page=${incomeFilter.page > 1 ? incomeFilter.page - 1 : 1}`} className={clsx('rounded border bg-sky-500 px-3 p-1', incomeFilter.page <= 1 && 'pointer-events-none opacity-50')}>Previous</Link></td>
                    <td colSpan={5}></td>
                    <td className="pt-4"><Link href={`/income?page=${incomeFilter.page < maxPages ? incomeFilter.page + 1 : maxPages}`} className={clsx('rounded border bg-sky-500 px-3.5 py-1 float-right', incomeFilter.page >= maxPages && 'pointer-events-none opacity-50')}>Next</Link></td>
                </tr>
            </table>
        </div>

    );
}