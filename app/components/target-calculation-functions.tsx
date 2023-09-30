import { TargetClass } from "../models/Target";

interface TargetItemProps {
    expenseTargets: TargetClass[]
}

export function calculateTotal(targets: TargetClass[] | undefined){
    let targetTotal: number = 0
    
    if(targets === undefined){
        return(targetTotal);
    } else {
        for(const target of targets){
            targetTotal = targetTotal + target.targetAmount
        }
    }

    return(targetTotal);
};

export function caculateDifference(expenseTotal: number, incomeTotal: number){
    let difference: number = 0

    difference = incomeTotal - expenseTotal

    return(difference);
};
