import { TargetClass } from "../models/Target";
import React, { useState } from "react";
import DeleteCategory from "./delete-category-item-server";

interface TargetItemProps {
    target: TargetClass
}

const CategoryItem: React.FC<TargetItemProps> = ({ target }) => {
    return(
        <div>
            <label htmlFor="target">{target.categoryName}:</label>
            <input type="number" step="any" name={target.id} defaultValue={target.targetAmount} className="border rounded px-1 py-1 w-52" />
        </div>
    );
};

export default CategoryItem;
