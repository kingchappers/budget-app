import { Transaction } from "../models/Transaction";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";
import { startOfMonth, endOfMonth } from "date-fns";

export interface TransactionFilter {
    page?: number;
    limit?: number;
    userId: string;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getTransactions(filter: TransactionFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find({ userId: filter.userId }).sort({ transactionDate: -1 }).skip(skip).limit(limit).lean().exec();

        const results = transactions.length;

        const totalDocuments = await Transaction.estimatedDocumentCount()
        const maxPages = Math.ceil(totalDocuments / limit) ?? 1

        return {
            transactions: transactions,
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

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getTransactionsBetweenDates(filter: TransactionFilter, startDate?: Date, endDate?: Date) {
    try {
        connectDB();

        const searchStartDate = startDate ?? startOfMonth(new Date())
        const searchEndDate = endDate ?? endOfMonth(new Date())

        const transactions = await Transaction.find({ userId: filter.userId, transactionDate: { $gte: searchStartDate, $lte: searchEndDate } }).sort({ transactionDate: -1 }).lean().exec();

        const results = transactions.length;

        return {
            transactions: transactions,
            results
        };

    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getOldestOrNewestTransaction(filter: TransactionFilter, oldest: boolean) {
    try {
        connectDB();

        const userId = filter.userId;

        if (oldest == true) {
            var transaction = await Transaction.findOne({ userId: userId }).sort({ transactionDate: 1 }).lean().exec();
        } else {
            var transaction = await Transaction.findOne({ userId: userId }).sort({ transactionDate: -1 }).lean().exec();
        }

        var transactionFound = false;

        if (transaction) {
            transactionFound = true;
        }

        if (transaction) {
            return {
                transaction,
                transactionFound
            };
        } else {
            return {
                error: "Transaction not found",
                transactionFound
            };
        }

    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function getTransaction(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Transaction not found" };
        }

        const transaction = await Transaction.findById(parsedId).lean().exec();
        if (transaction) {
            return {
                transaction,
            };
        } else {
            return { error: "Transaction not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createTransaction(
    transactionDate: Date,
    vendor: string,
    value: number,
    category: string,
    items: string,
    notes: string,
    userId: string,
) {
    try {
        await connectDB();

        const transaction = await Transaction.create({ transactionDate, vendor, value, category, items, notes, userId });

        return {
            transaction
        };
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateTransaction(
    id: string,
    { transactionDate, vendor, value, category, items, notes, checked }: { transactionDate?: Date; vendor?: string; value?: number; category?: string, items?: string, notes?: string; checked?: boolean; }
) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Transaction not found" };
        }

        const transaction = await Transaction.findByIdAndUpdate(
            parsedId,
            { transactionDate, vendor, value, category, items, notes, checked },
            { new: true }
        )
            .lean()
            .exec();

        if (transaction) {
            return {
                transaction,
            };
        } else {
            return { error: "Transaction not found" };
        }
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function deleteTransaction(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: "Transaction not found" };
        }

        const transaction = await Transaction.findByIdAndDelete(parsedId).exec();

        if (transaction) {
            return {};
        } else {
            return { error: "Transaction not found" };
        }
    } catch (error) {
        return { error };
    }
}