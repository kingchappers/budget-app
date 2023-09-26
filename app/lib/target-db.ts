import { Target } from "../models/Target";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";

interface TargetFilter {
    page?: number;
    limit?: number;
}

export async function getTargets(filter: TargetFilter = {}) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        const targets = await Target.find().skip(skip).sort({ categoryName: 1 }).limit(limit).lean().exec();

        const results = targets.length;

        return {
            targets: targets,
            page,
            limit,
            results
        };
    } catch (error) {
        return { error };
    }
}

export async function createTarget(
    categoryName: string, 
    targetAmount: number, 
    expenseTarget: boolean, 
) {
    try {
        await connectDB();

        const target = await Target.create({ categoryName, targetAmount, expenseTarget }); 

        return {
            target
        };
    } catch (error) {
        return { error };
    }
}

export async function getTarget(id: string) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Target not found" };
        }
  
      const target = await Target.findById(parsedId).lean().exec();
        if (target) {
            return {
                target,
            };
        } else {
            return { error: "Target not found" };
        }
    } catch (error) {
        return { error };
    }
}
  
export async function updateTarget(
    id: string,
    { categoryName, targetAmount, expenseTarget } : { categoryName?: string; targetAmount?: number; expenseTarget?: boolean; } 
) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Target not found" };
        }
  
        const target = await Target.findByIdAndUpdate(
            parsedId,
            { categoryName, targetAmount, expenseTarget }, 
            { new: true }
        )
        .lean()
        .exec();
  
        if (target) {
            return {
                target,
            };
        } else {
            return { error: "Target not found" };
      }
    } catch (error) {
        return { error };
    }
}
  
  export async function deleteTarget(id: string) {
    try {
        await connectDB();
  
        const parsedId = stringToObjectId(id);
  
        if (!parsedId) {
            return { error: "Target not found" };
        }
  
        const target = await Target.findByIdAndDelete(parsedId).exec();
  
        if (target) {
            return {};
        } else {
            return { error: "Target not found" };
        }
    } catch (error) {
        return { error };
    }
}