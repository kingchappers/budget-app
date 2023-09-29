import { TargetClass } from "../models/Target";
import React from "react";

interface TargetItemProps {
    expenseTargets: TargetClass[]
}

export function calculateTotal(targets: TargetClass[] | undefined){
    let targetTotal: number = 0
    
    if(targets === undefined){
        return;
    } else {
        for(const target of targets){
            targetTotal = targetTotal + target.targetAmount
        }
    }

    return(targetTotal);
};


