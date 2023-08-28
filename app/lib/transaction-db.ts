import { Transaction } from "../models/Transaction";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";

interface TransactionFilter {
    page?: number;
    limit?: number;
}

export async function getTransactions(filter: TransactionFilter = {}) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find().skip(skip).limit(limit).lean().exec();

        const results = transactions.length;

        return {
            transactions: transactions,
            page,
            limit,
            results
        };
    } catch (error) {
        return { error };
    }
}

export async function createTransaction(
    transactionDate: string, 
    transactionVendor: string, 
    transactionValue: number, 
    transactionCategory: string, 
    transactionItems: string, 
    transcationNotes: string
) {
    try {
        await connectDB();

        const transaction = await Transaction.create({ transactionDate, transactionVendor, transactionValue, transactionCategory, transactionItems, transcationNotes });

        return {
            transaction,
        };
    } catch (error) {
        return { error };
    }
}

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
  
export async function updateTransaction(
    id: string,
    { transactionDate, transactionVendor, transactionValue, transactionCategory, transactionItems, transcationNotes }: { transactionDate?: string; transactionVendor?: string, transactionValue?: number, transactionCategory?: string, transactionItems?: string, transcationNotes?: string}
) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Transaction not found" };
        }
  
        const transaction = await Transaction.findByIdAndUpdate(
            parsedId,
            { transactionDate, transactionVendor, transactionValue, transactionCategory, transactionItems, transcationNotes },
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