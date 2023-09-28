import { Target } from "../models/Target";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";

export interface TargetFilter {
    page?: number;
    limit?: number;
    type?: string;
}

export async function getTargets(filter: TargetFilter) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;
        const type = filter.type ?? "";

        let targets;

        if(type === "expense"){
            targets = await Target.find({ expenseTarget: true }).skip(skip).sort({ categoryName: 1 }).limit(limit).lean().exec();
        } else if (type === "income"){
            targets = await Target.find({ expenseTarget: false }).skip(skip).sort({ categoryName: 1 }).limit(limit).lean().exec();
        } else {
            targets = await Target.find().skip(skip).sort({ categoryName: 1 }).limit(limit).lean().exec();
        } 

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

export async function getTargetsByName(filter: TargetFilter, targetName: string) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;
        const skip = (page - 1) * limit;

        let targets = await Target.find({ categoryName: targetName }).skip(skip).sort({ categoryName: 1 }).limit(limit).lean().exec();

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

        const existingTarget = await Target.findOne({
            categoryName: categoryName,
            expenseTarget: expenseTarget
        });

        if (existingTarget){
            return { error: "Target with this name and type already exists" };
        }

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