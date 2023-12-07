"use server";

import { createSaving, deleteSaving, updateSaving, getSavingsBetweenDates, getSavingsOnDate } from "./lib/saving-db";
import { revalidatePath } from "next/cache";
import { stringToDate } from "./lib/utils";

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getSavingsBetweenDatesAction({
    userId,
    startDate,
    endDate,
}: {
    userId: string;
    startDate: Date;
    endDate: Date;
}) {
    const { savings, results } = await getSavingsBetweenDates(userId, startDate, endDate)

    return {
        savings: savings,
        results
    };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getSavingsOnDateAction({
    userId,
    savingDate,
}: {
    userId: string;
    savingDate: Date;
}) {
    const { savings, results } = await getSavingsOnDate(userId, savingDate)

    return {
        savings: savings,
        results
    };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createSavingAction({
    monthStart,
    value,
    userId,
    path,
}: {
    monthStart: string,
    value: number,
    userId: string,
    path: string,
}) {
    const parsedSavingDate = stringToDate(monthStart)
    await createSaving(parsedSavingDate, value, userId);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________


export async function createInitialSavingAction({
    value,
    userId,
    path,
}: {
    value: number,
    userId: string,
    path: string,
}) {
    const savingDate = new Date("2000-01-01")
    const { savings, results } = await getSavingsOnDate(userId, savingDate)
    console.log(results)
    if (results) {
        const savingId = savings[0].id
        const update = {value}
        await updateSavingAction(savingId, update, path)
    } else {
        await createSaving(savingDate, value, userId)
        revalidatePath(path)
    }

}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateSavingAction(
    id: string,
    update: { monthStart?: Date; value?: number; },
    path: string
) {
    await updateSaving(id, update);
    revalidatePath(path);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteSavingAction({
    id,
    path,
}: {
    id: string;
    path: string;
}) {
    await deleteSaving(id);
    revalidatePath(path);
}