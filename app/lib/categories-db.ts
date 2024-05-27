import { Category } from "../models/Category";
import connectDB from "./mongoose-connect-db";
import { stringToObjectId } from "./utils";

export interface CategoryFilter {
    page?: number;
    limit?: number;
    type?: string;
    userId: string;
}

export async function getCategories(filter: CategoryFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const type = filter.type ?? "";
        const skip = (page - 1) * limit;

        let categories;

        if (type === "income") {
            categories = await Category.find({ incomeCategory: true, userId: filter.userId }).skip(skip).sort({ label: 1 }).limit(limit).lean().exec();
        } else if (type === "transaction") {
            categories = await Category.find({ transactionCategory: true, userId: filter.userId }).skip(skip).sort({ label: 1 }).limit(limit).lean().exec();
        } else {
            categories = await Category.find({ userId: filter.userId }).skip(skip).sort({ label: 1 }).limit(limit).lean().exec();
        }

        const results = categories.length;

        return {
            categories: categories,
            page,
            limit,
            results
        };
    } catch (error) {
        // console.log(error)
        // console.log("couldn't get categories")
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function createCategory(
    label: string,
    transactionCategory: boolean,
    incomeCategory: boolean,
    userId: string,
) {
    try {
        await connectDB();

        const category = await Category.create({ label, transactionCategory, incomeCategory, userId });

        return {
            label
        };
    } catch (error) {
        return { error };
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

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

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export async function updateCategory(
    id: string,
    { label, transactionCategory, incomeCategory }: { label?: string; transactionCategory?: boolean; incomeCategory?: boolean }
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

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

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