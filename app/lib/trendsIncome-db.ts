import { TrendsIncome } from "../models/TrendsIncome";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";

export interface TrendsIncomeFilter {
    page?: number;
    limit?: number;
    userId: string;
}

export async function getTrendIncomes(filter: TrendsIncomeFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 12;
        const skip = (page - 1) * limit;

        const trendsIncomes = await TrendsIncome.find({ userId: filter.userId }).skip(skip).sort({ month: 1 }).limit(limit).lean().exec();

        const results = trendsIncomes.length;

        return {
            trendsIncomes: trendsIncomes,
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

export async function getTrendsIncome(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Trend Income not found" };
        }

        const trendIncome = await TrendsIncome.findById(parsedId).lean().exec();
        if (trendIncome) {
            return {
                trendIncome,
            };
        } else {
            return { error: "Trend Income not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createTrendIncomes(
    month: Date,
    monthTotal: number,
    userId: string,
) {
    try {
        await connectDB();

        const trendIncome = await TrendsIncome.create({ month, monthTotal, userId });

        return {
            trendIncome
        };
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateTrendIncome(
    id: string,
    { month, monthTotal }: { month?: Date; monthTotal?: number; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Trend Income not found" };
        }

        const trendIncome = await TrendsIncome.findByIdAndUpdate(
            parsedId,
            { month, monthTotal },
            { new: true }
        )
            .lean()
            .exec();

        if (trendIncome) {
            return {
                trendIncome,
            };
        } else {
            return { error: "Trend Income not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteTrendIncome(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Trend Income not found" };
        }

        const trendIncome = await TrendsIncome.findByIdAndDelete(parsedId).exec();

        if (trendIncome) {
            return {};
        } else {
            return { error: "Trend Income not found" };
        }
    } catch (error) {
        return { error };
    }
}