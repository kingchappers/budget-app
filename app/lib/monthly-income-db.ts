import { MonthlyIncome } from "../models/MonthlyIncome";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";
import { startOfMonth, endOfMonth } from "date-fns";

export interface MonthlyIncomeFilter {
    page?: number;
    limit?: number;
    userId: string;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlyIncomes(filter: MonthlyIncomeFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 12;
        const skip = (page - 1) * limit;

        const mothlyIncomes = await MonthlyIncome.find({ userId: filter.userId }).skip(skip).sort({ month: 1 }).limit(limit).lean().exec();

        const results = mothlyIncomes.length;

        return {
            mothlyIncomes: mothlyIncomes,
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

export async function getMonthlyIncomesBetweenDates(filter: MonthlyIncomeFilter, startDate?: Date, endDate?: Date) {
    try {
        connectDB();

        const searchStartDate = startDate ?? startOfMonth(new Date())
        const searchEndDate = endDate ?? endOfMonth(new Date())

        const mothlyIncomes = await MonthlyIncome.find({ userId: filter.userId, month: { $gte: searchStartDate, $lte: searchEndDate } }).sort({ month: -1 }).lean().exec();

        const results = mothlyIncomes.length;

        return {
            mothlyIncomes: mothlyIncomes,
            results
        };

    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlyIncome(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Income not found" };
        }

        const mothlyIncome = await MonthlyIncome.findById(parsedId).lean().exec();
        if (mothlyIncome) {
            return {
                mothlyIncome,
            };
        } else {
            return { error: "Monthly Income not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createMonthlyIncome(
    month: Date,
    monthTotal: number,
    monthCategoryTotals: object,
    userId: string,
) {
    try {
        await connectDB();

        const mothlyIncome = await MonthlyIncome.create({ month, monthTotal, monthCategoryTotals, userId });

        return {
            mothlyIncome
        };
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateMonthlyIncome(
    id: string,
    { month, monthTotal, monthCategoryTotals }: { month?: Date; monthTotal?: number; monthCategoryTotals?: object; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Income not found" };
        }

        const mothlyIncome = await MonthlyIncome.findByIdAndUpdate(
            parsedId,
            { month, monthTotal, monthCategoryTotals },
            { new: true }
        )
            .lean()
            .exec();

        if (mothlyIncome) {
            return {
                mothlyIncome,
            };
        } else {
            return { error: "Monthly Income not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteMonthlyIncome(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Income not found" };
        }

        const mothlyIncome = await MonthlyIncome.findByIdAndDelete(parsedId).exec();

        if (mothlyIncome) {
            return {};
        } else {
            return { error: "Monthly Income not found" };
        }
    } catch (error) {
        return { error };
    }
}