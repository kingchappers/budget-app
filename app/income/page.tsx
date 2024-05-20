import { IncomeForm } from "../components/income-form-server";
import { IncomeItem } from "../components/income-item-server";
import { IncomeFilter, getIncomes } from "../lib/income-db";
import { getCategories, CategoryFilter } from "../lib/categories-db";
import { CategoriesComboProps } from "../components/comboBox";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { getLastTwelveMonths } from "../lib/utils";
import { createMonthlyIncomeAction, getMonthlyIncomesBetweenDatesAction } from "../_monthlyIncomeActions";
import { getListOfYearsIncomeTotalsByMonth, getYearOfCategoryIncome } from "../components/trend-income-calculations";

export default async function Home({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;

    const filter: CategoryFilter = {
        limit: 30,
        type: "income",
        userId: session.user.id
    }

    let incomeFilter: IncomeFilter = {
        page: typeof searchParams.page === 'string' ? Number(searchParams.page) : 1,
        limit: typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 50,
        userId: userId
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

    const months = getLastTwelveMonths()
    const { monthlyIncomes, results: monthlyIncomesResults } = await getMonthlyIncomesBetweenDatesAction({ userId, startDate: months[0], endDate: months[months.length - 1] })
    if (monthlyIncomesResults) {
        console.log("Incomes found!")
    } else {
        // If there are no entries in the incomes trend table, create them!
        console.log("No incomes found :(")
        const { monthlyIncomeData } = await getListOfYearsIncomeTotalsByMonth(userId)
        const incomesExist = monthlyIncomeData.some(item => item.value !== 0)
        if (incomesExist) {
            const { yearOfCategoryIncome, results } = await getYearOfCategoryIncome(userId, months)
            yearOfCategoryIncome.map(async (monthOfCategoryIncome) => (
                await createMonthlyIncomeAction({ month: monthOfCategoryIncome.month, monthTotal: monthOfCategoryIncome.monthTotal, monthCategoryTotals: monthOfCategoryIncome.monthCategoryTotal, userId, path: "/" })
            ))
        } else {
            console.log("No transactions currently exist")
        }
    }

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <IncomeForm categories={listOfCategories} userId={userId} />

            <h1 className="text-2xl font-bold mb-4">Income List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left">
                        <th className="px-3 lg:px-5 w-5 lg:w-20">Date</th>
                        <th className="px-3 lg:px-5 w-24 lg:w-48">Company</th>
                        <th className="px-3 lg:px-5 lg:w-24">Amount</th>
                        <th className="px-3 lg:px-5 lg:w-48">Category</th>
                        <th className="px-3 lg:px-5 lg:w-80">Notes</th>
                        <th className="px-3 lg:px-5 lg:w-5"></th>
                    </tr>
                </thead>


                {results === 0 ? (
                    <tbody>
                        <td colSpan={6} className="text-center">No Incomes Found</td>
                    </tbody>
                ) : (
                    incomes?.map((income) => (
                        <IncomeItem key={income.id} income={income} categories={listOfCategories} userId={userId} />
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