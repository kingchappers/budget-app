import { MonthlySpend } from "../models/MonthlySpend";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";
import { startOfMonth, endOfMonth } from "date-fns";

export interface MonthlySpendFilter {
    page?: number;
    limit?: number;
    userId: string;
}

export async function getMonthlySpends(filter: MonthlySpendFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 12;
        const skip = (page - 1) * limit;

        const mothlySpends = await MonthlySpend.find({ userId: filter.userId }).skip(skip).sort({ month: 1 }).limit(limit).lean().exec();

        const results = mothlySpends.length;

        return {
            mothlySpends: mothlySpends,
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

export async function getMonthlySpendsBetweenDates(filter: MonthlySpendFilter, startDate?: Date, endDate?: Date) {
    try {
        connectDB();

        const searchStartDate = startDate ?? startOfMonth(new Date())
        const searchEndDate = endDate ?? endOfMonth(new Date())

        const mothlySpends = await MonthlySpend.find({ userId: filter.userId, month: { $gte: searchStartDate, $lte: searchEndDate } }).sort({ month: -1 }).lean().exec();

        const results = mothlySpends.length;

        return {
            mothlySpends: mothlySpends,
            results
        };

    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlySpend(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Spend not found" };
        }

        const mothlySpend = await MonthlySpend.findById(parsedId).lean().exec();
        if (mothlySpend) {
            return {
                mothlySpend,
            };
        } else {
            return { error: "Monthly Spend not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createMonthlySpend(
    month: Date,
    monthTotal: number,
    userId: string,
) {
    try {
        await connectDB();

        const mothlySpend = await MonthlySpend.create({ month, monthTotal, userId });

        return {
            mothlySpend
        };
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateMonthlySpend(
    id: string,
    { month, monthTotal }: { month?: Date; monthTotal?: number; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Spend not found" };
        }

        const mothlySpend = await MonthlySpend.findByIdAndUpdate(
            parsedId,
            { month, monthTotal },
            { new: true }
        )
            .lean()
            .exec();

        if (mothlySpend) {
            return {
                mothlySpend,
            };
        } else {
            return { error: "Monthly Spend not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteMonthlySpend(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Spend not found" };
        }

        const mothlySpend = await MonthlySpend.findByIdAndDelete(parsedId).exec();

        if (mothlySpend) {
            return {};
        } else {
            return { error: "Monthly Spend not found" };
        }
    } catch (error) {
        return { error };
    }
}