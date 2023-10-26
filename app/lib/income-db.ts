import { Income } from "../models/Income";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";
import { startOfMonth, endOfMonth } from "date-fns";

export interface IncomeFilter {
    page?: number;
    limit?: number;
    userId: string;
}

export async function getIncomes(filter: IncomeFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const incomes = await Income.find({ userId: filter.userId }).skip(skip).sort({ incomeDate: -1 }).limit(limit).lean().exec();

        const results = incomes.length;

        const totalDocuments = await Income.estimatedDocumentCount()
        const maxPages = Math.ceil(totalDocuments / limit) ?? 1

        return {
            incomes: incomes,
            page,
            limit,
            results,
            maxPages
        };
    } catch (error) {
        return { error };
    }
}

export async function getIncomesBetweenDates(filter: IncomeFilter, startDate?: Date, endDate?: Date) {
    try {
        connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const searchStartDate = startDate ?? startOfMonth(new Date())
        const searchEndDate = endDate ?? endOfMonth(new Date())

        const incomes = await Income.find({ userId: filter.userId, incomeDate: { $gte: searchStartDate, $lte: searchEndDate } }).sort({ incomeDate: -1 }).skip(skip).limit(limit).lean().exec();

        const results = incomes.length;

        return {
            incomes: incomes,
            page,
            limit,
            results
        };

    } catch (error) {
        return { error };
    }
}

export async function createIncome(
    incomeDate: Date,
    company: string,
    amount: number,
    incomeCategory: string,
    notes: string,
    userId: string
) {
    try {
        await connectDB();

        const income = await Income.create({ incomeDate, company, amount, incomeCategory, notes, userId });

        return {
            income
        };
    } catch (error) {
        return { error };
    }
}

export async function getIncome(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Income not found" };
        }

        const income = await Income.findById(parsedId).lean().exec();
        if (income) {
            return {
                income,
            };
        } else {
            return { error: "Income not found" };
        }
    } catch (error) {
        return { error };
    }
}

export async function updateIncome(
    id: string,
    { incomeDate, company, amount, incomeCategory, notes }: { incomeDate?: Date; company?: string; amount?: number; incomeCategory?: string, notes?: string; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Income not found" };
        }

        const income = await Income.findByIdAndUpdate(
            parsedId,
            { incomeDate, company, amount, incomeCategory, notes },
            { new: true }
        )
            .lean()
            .exec();

        if (income) {
            return {
                income,
            };
        } else {
            return { error: "Income not found" };
        }
    } catch (error) {
        return { error };
    }
}

export async function deleteIncome(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Income not found" };
        }

        const income = await Income.findByIdAndDelete(parsedId).exec();

        if (income) {
            return {};
        } else {
            return { error: "Income not found" };
        }
    } catch (error) {
        return { error };
    }
}