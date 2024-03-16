import { TrendsSpend } from "../models/TrendsSpend";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";

export interface TrendsSpendFilter {
    page?: number;
    limit?: number;
    userId: string;
}

export async function getTrendsSpends(filter: TrendsSpendFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 12;
        const skip = (page - 1) * limit;

        const trendsSpend = await TrendsSpend.find({ userId: filter.userId }).skip(skip).sort({ month: 1 }).limit(limit).lean().exec();

        const results = trendsSpend.length;

        return {
            trendsSpend: trendsSpend,
            page,
            limit,
            results
        };
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getTrendsSpend(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Trend Spend not found" };
        }

        const trendsSpend = await TrendsSpend.findById(parsedId).lean().exec();
        if (trendsSpend) {
            return {
                trendsSpend,
            };
        } else {
            return { error: "Trend Spend not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createTrendsSpend(
    month: Date,
    monthTotal: number,
    userId: string,
) {
    try {
        await connectDB();

        const trendsSpend = await TrendsSpend.create({ month, monthTotal, userId });

        return {
            trendsSpend
        };
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateTrendsSpend(
    id: string,
    { month, monthTotal }: { month?: Date; monthTotal?: number; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Trend Spend not found" };
        }

        const trendsSpend = await TrendsSpend.findByIdAndUpdate(
            parsedId,
            { month, monthTotal },
            { new: true }
        )
            .lean()
            .exec();

        if (trendsSpend) {
            return {
                trendsSpend,
            };
        } else {
            return { error: "Trend Spend not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteTrendsSpend(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Trend Spend not found" };
        }

        const trendsSpend = await TrendsSpend.findByIdAndDelete(parsedId).exec();

        if (trendsSpend) {
            return {};
        } else {
            return { error: "Trend Spend not found" };
        }
    } catch (error) {
        return { error };
    }
}