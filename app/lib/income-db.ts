import { Income } from "../models/Income";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";

interface IncomeFilter {
    page?: number;
    limit?: number;
}

export async function getIncomes(filter: IncomeFilter = {}) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const incomes = await Income.find().skip(skip).limit(limit).lean().exec();

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
    incomeDate: string, 
    company: string, 
    ammount: number, 
    incomeCategory: string, 
    notes: string
) {
    try {
        await connectDB();

        const income = await Income.create({ incomeDate, company, ammount, incomeCategory, notes }); 

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
    { incomeDate, company, ammount, incomeCategory, notes } : { incomeDate?: string; company?: string; ammount?: number; incomeCategory?: string, notes?: string; } 
) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Income not found" };
        }
  
        const income = await Income.findByIdAndUpdate(
            parsedId,
            { incomeDate, company, ammount, incomeCategory, notes }, 
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