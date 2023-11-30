import { getServerSession } from "next-auth";
import { SavingForm } from "../components/savings-form-server";
import { SavingItem } from "../components/savings-item-server";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import { createSaving, getSavingByDate, getSavings, SavingFilter, updateSaving } from "../lib/saving-db";
import Link from "next/link";
import clsx from "clsx";
import { calculateInitialSavings, calculateSavingsUpdate, calculateTotalSaved, createSavings } from "../components/savings-calculations";

export default async function Savings({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;

    let savingFilter: SavingFilter = {
        page: typeof searchParams.page === 'string' ? Number(searchParams.page) : 1,
        limit: typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 50,
        userId: userId,
    }

    let { savings, results: savingsResults, maxPages: savingsMaxPages } = await getSavings(savingFilter);

    if (savingsMaxPages == undefined) {
        savingsMaxPages = 1;
    }

    if (savingFilter.page == undefined) {
        savingFilter.page = 1;
    }

    if (savingFilter.limit == undefined) {
        savingFilter.limit = 50;
    }

    if (savingsResults != null && savingsResults > 1) {
        // Do checks and calculations for multiple savings entry and calculate current savings
        const savingsUpdate = await calculateSavingsUpdate(userId)
        savingsUpdate.forEach(async (saving) => {
            const { saving: savingToUpdate } = await getSavingByDate(userId, saving.date)
            if (savingToUpdate) {
                const savingId = savingToUpdate._id.toString();
                updateSaving(savingId, saving)
            } else if (!savingToUpdate) {
                createSaving(saving.date, saving.value, userId)
            }
        })
    } else {
        // Do initial calculations to produce savings list
        const initialSavings = await calculateInitialSavings(userId)
        createSavings(initialSavings, userId)
    }

    const totalSaved = await calculateTotalSaved(userId)
    console.log(totalSaved)

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">
            <h1 className="text-3xl font-bold mb-4">Savings</h1>
            <SavingForm userId={userId} />

            <h1 className="text-2xl font-bold mb-4">Saving List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="text-center px-5 w-44">Month Saved</th>
                        <th className="text-center px-5 w-20">Value</th>
                    </tr>
                </thead>

                {savingsResults === 0 ? (
                    <tbody>
                        <td colSpan={2} className="text-center">No Transactions Found</td>
                    </tbody>
                ) : (
                    savings?.map((savings) => (
                        <SavingItem key={savings.id} saving={savings} />
                    ))
                )}

                <tr>
                    <td className="pt-4"><Link href={`/transactions?page=${savingFilter.page > 1 ? savingFilter.page - 1 : 1}`} className={clsx('rounded border bg-sky-500 px-3 p-1', savingFilter.page <= 1 && 'pointer-events-none opacity-50')}>Previous</Link></td>
                    <td className="pt-4"><Link href={`/transactions?page=${savingFilter.page < savingsMaxPages ? savingFilter.page + 1 : savingsMaxPages}`} className={clsx('rounded border bg-sky-500 px-3.5 py-1 float-right', savingFilter.page >= savingsMaxPages && 'pointer-events-none opacity-50')}>Next</Link></td>
                </tr>
            </table>
        </div>
    );
}