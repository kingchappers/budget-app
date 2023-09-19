import { Category } from "../models/Category";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";

interface CategoryFilter {
    page?: number;
    limit?: number;
}

export async function getCategories(filter: CategoryFilter = {}) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const categories = await Category.find().skip(skip).sort({ label: 1 }).limit(limit).lean().exec();

        const results = categories.length;

        return {
            categories: categories,
            page,
            limit,
            results
        };
    } catch (error) {
        return { error };
    }
}

export async function createCategory(
    label: string, 
    transactionCategory: string, 
    incomeCategory: string, 
) {
    try {
        await connectDB();

        const category = await Category.create({ label, transactionCategory, incomeCategory }); 

        return {
            label
        };
    } catch (error) {
        return { error };
    }
}

export async function getCategroy(id: string) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Category not found" };
        }
  
      const category = await Category.findById(parsedId).lean().exec();
        if (category) {
            return {
                category,
            };
        } else {
            return { error: "Category not found" };
        }
    } catch (error) {
        return { error };
    }
}
  
export async function updateCategory(
    id: string,
    { label, transactionCategory, incomeCategory } : { label?: string; transactionCategory?: string; incomeCategory?: string } 
) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Category not found" };
        }
  
        const category = await Category.findByIdAndUpdate(
            parsedId,
            { label, transactionCategory, incomeCategory }, 
            { new: true }
        )
        .lean()
        .exec();
  
        if (category) {
            return {
                category,
            };
        } else {
            return { error: "Category not found" };
      }
    } catch (error) {
        return { error };
    }
}
  
  export async function deleteCategory(id: string) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Category not found" };
        }
  
        const category = await Category.findByIdAndDelete(parsedId).exec();
  
        if (category) {
            return {};
        } else {
            return { error: "Category not found" };
        }
    } catch (error) {
        return { error };
    }
}