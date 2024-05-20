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

        const monthlyIncomes = await MonthlyIncome.find({ userId: filter.userId }).skip(skip).sort({ month: 1 }).limit(limit).lean().exec();

        const results = monthlyIncomes.length;

        return {
            monthlyIncomes: monthlyIncomes,
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

        console.log(startDate)
        console.log(endDate)

        const searchStartDate = startDate ?? startOfMonth(new Date())
        const searchEndDate = endDate ?? endOfMonth(new Date())

        const monthlyIncomes = await MonthlyIncome.find({ userId: filter.userId, month: { $gte: searchStartDate, $lte: searchEndDate } }).sort({ month: -1 }).lean().exec();

        const results = monthlyIncomes.length;

        return {
            monthlyIncomes: monthlyIncomes,
            results
        };

    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getMonthlyIncomeByMonth(filter: MonthlyIncomeFilter, month: Date) {
    try {
        await connectDB();

        if (!month) {
            return { error: "Monthly Income not found" };
        }

        const monthlyIncome = await MonthlyIncome.findOne({ userId: filter.userId, month: month }).lean().exec();

        if (monthlyIncome) {
            monthlyIncome.id = monthlyIncome._id.toString()
            return {
                monthlyIncome,
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

export async function getMonthlyIncome(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Monthly Income not found" };
        }

        const monthlyIncome = await MonthlyIncome.findById(parsedId).lean().exec();
        if (monthlyIncome) {
            return {
                monthlyIncome,
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

        const monthlyIncome = await MonthlyIncome.create({ month, monthTotal, monthCategoryTotals, userId });

        return {
            monthlyIncome
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

        const monthlyIncome = await MonthlyIncome.findByIdAndUpdate(
            parsedId,
            { month, monthTotal, monthCategoryTotals },
            { new: true }
        )
            .lean()
            .exec();

        if (monthlyIncome) {
            return {
                monthlyIncome,
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

        const monthlyIncome = await MonthlyIncome.findByIdAndDelete(parsedId).exec();

        if (monthlyIncome) {
            return {};
        } else {
            return { error: "Monthly Income not found" };
        }
    } catch (error) {
        return { error };
    }
}