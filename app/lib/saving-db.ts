import { Saving } from "../models/Savings";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";
import { startOfMonth, endOfMonth } from "date-fns";

export interface SavingFilter {
    page?: number;
    limit?: number;
    userId: string;
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function getSavings(filter: SavingFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const savings = await Saving.find({ userId: filter.userId }).sort({ monthStart: -1 }).skip(skip).limit(limit).lean().exec();

        const results = savings.length;

        const totalDocuments = await Saving.estimatedDocumentCount()
        const maxPages = Math.ceil(totalDocuments / limit) ?? 1

        return {
            savings: savings,
            page,
            limit,
            results,
            totalDocuments,
            maxPages
        };
    } catch (error) {
        return { error };
    }
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function getSavingsBetweenDates(userId: string, startDate?: Date, endDate?: Date) {
    try {
        connectDB();

        const searchStartDate = startDate ?? startOfMonth(new Date())
        const searchEndDate = endDate ?? endOfMonth(new Date())

        const savings = await Saving.find({ userId: userId, monthStart: { $gte: searchStartDate, $lte: searchEndDate } }).sort({ monthStart: -1 }).lean().exec();

        const results = savings.length;

        return {
            savings: savings,
            results
        };

    } catch (error) {
        return { error };
    }
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function getSavingsOnDate(userId: string, savingDate?: Date) {
    try {
        connectDB();

        const savings = await Saving.find({ userId: userId, monthStart: savingDate }).sort({ monthStart: -1 }).lean().exec();

        const results = savings.length;

        return {
            savings: savings,
            results
        };

    } catch (error) {
        return { error };
    }
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function getLatestSaving(userId: string) {
    try {
        connectDB();

        const saving = await Saving.findOne({ userId: userId, monthStart: { $ne: "2000-01-01T00:00:00.000Z" } }).sort({ monthStart: -1 }).lean().exec();

        return { saving };

    } catch (error) {
        return { error };
    }
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function getSavingByDate(userId: string, date: Date) {
    // ___________________________________________________________________________________________________________________________________________________
    // ___________________________________________________________________________________________________________________________________________________
    // ___________________________________________________________________________________________________________________________________________________
    // ___________________________________________________________________________________________________________________________________________________
    // ___________________________________________________________________________________________________________________________________________________
    // ___________________________________________________________________________________________________________________________________________________

    

}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function getSaving(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Saving not found" };
        }

        const saving = await Saving.findById(parsedId).lean().exec();
        if (saving) {
            return {
                saving,
            };
        } else {
            return { error: "Saving not found" };
        }
    } catch (error) {
        return { error };
    }
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function createSaving(
    monthStart: Date,
    value: number,
    userId: string,
) {
    try {
        await connectDB();

        const saving = await Saving.create({ monthStart, value, userId });

        return {
            saving
        };
    } catch (error) {
        return { error };
    }
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function updateSaving(
    id: string,
    { monthStart, value }: { monthStart?: Date; value?: number; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Saving not found" };
        }

        const saving = await Saving.findByIdAndUpdate(
            parsedId,
            { monthStart, value },
            { new: true }
        )
            .lean()
            .exec();

        if (saving) {
            return {
                saving,
            };
        } else {
            return { error: "Saving not found" };
        }
    } catch (error) {
        return { error };
    }
}

// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________________________________________

export async function deleteSaving(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Saving not found" };
        }

        const saving = await Saving.findByIdAndDelete(parsedId).exec();

        if (saving) {
            return {};
        } else {
            return { error: "Saving not found" };
        }
    } catch (error) {
        return { error };
    }
}