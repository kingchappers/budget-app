import { MonthlySpend, monthCategoryTotal} from "../models/MonthlySpend";
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

        const monthlySpends = await MonthlySpend.find({ userId: filter.userId }).skip(skip).sort({ month: 1 }).limit(limit).lean().exec();

        const results = monthlySpends.length;

        return {
            monthlySpends: monthlySpends,
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

        const monthlySpends = await MonthlySpend.find({ userId: filter.userId, month: { $gte: searchStartDate, $lte: searchEndDate } }).sort({ month: -1 }).lean().exec();

        const results = monthlySpends.length;

        return {
            monthlySpends: monthlySpends,
            results
        };

    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlySpendByMonth(filter: MonthlySpendFilter, month: Date) {
    try {
        await connectDB();

        if (!month) {
            return { error: "Monthly Spend not found" };
        }

        const monthlySpend = await MonthlySpend.findOne({ userId:filter.userId, month: month }).lean().exec();

        if (monthlySpend) {
            return {
                monthlySpend,
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

export async function getMonthlySpend(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Spend not found" };
        }

        const monthlySpend = await MonthlySpend.findById(parsedId).lean().exec();
        if (monthlySpend) {
            return {
                monthlySpend,
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
    monthCategoryTotals: monthCategoryTotal[],
    userId: string,
) {
    try {
        await connectDB();

        const monthlySpend = await MonthlySpend.create({ month, monthTotal, monthCategoryTotals, userId });

        return {
            monthlySpend
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
    { month, monthTotal, monthCategoryTotals }: { month?: Date; monthTotal?: number; monthCategoryTotals?: monthCategoryTotal[]; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Spend not found" };
        }

        const monthlySpend = await MonthlySpend.findByIdAndUpdate(
            parsedId,
            { month, monthTotal, monthCategoryTotals },
            { new: true }
        )
            .lean()
            .exec();

        if (monthlySpend) {
            return {
                monthlySpend,
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

        const monthlySpend = await MonthlySpend.findByIdAndDelete(parsedId).exec();

        if (monthlySpend) {
            return {};
        } else {
            return { error: "Monthly Spend not found" };
        }
    } catch (error) {
        return { error };
    }
}