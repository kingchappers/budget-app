"use server";

import { createSaving, deleteSaving, updateSaving, getSavingsBetweenDates } from "./lib/saving-db";
import { revalidatePath } from "next/cache";
import { stringToDate } from "./lib/utils";

/**
 * Server Action: Get a savings between dates
 */
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

/**
 * Server Action: Create a new saving
 */
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

/**
 * Server Action: Update an existing saving
 */
export async function updateSavingAction(
    id: string,
    update: { monthStart?: Date; value?: number; },
    path: string
) {
    await updateSaving(id, update);
    revalidatePath(path);
}

/**
 * Server Action: Delete a saving
 */
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