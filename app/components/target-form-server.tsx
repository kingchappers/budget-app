import { TargetClass } from "../models/Target";
import React from "react";

interface TargetItemProps {
    target: TargetClass
}

const TargetItem: React.FC<TargetItemProps> = ({ target }) => {
    return(
        <div className="flex items-center space-x-2 space-y-2">
            <label htmlFor="target" className="align-middle text-right ml-1 pt-2 w-48">{target.categoryName}: </label>
            <input type="number" step="any" name={target.id} defaultValue={target.targetAmount} className="border rounded pl-1 w-24" />
        </div>
    );
};

export default TargetItem;
