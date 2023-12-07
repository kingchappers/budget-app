import { IncomeClass } from "../models/Income";
import { TargetClass } from "../models/Target";
import { TransactionClass } from "../models/Transaction";

export function calculateTargetsTotal(targets: TargetClass[] | undefined) {
    let targetTotal: number = 0

    if (targets === undefined) {
        return (targetTotal);
    } else {
        for (const target of targets) {
            targetTotal = targetTotal + target.targetAmount
        }
    }

    return (targetTotal);
};

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function calculateDifference(expenseTotal: number, incomeTotal: number) {
    let difference: number = 0

    difference = incomeTotal - expenseTotal

    return (difference);
};

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function calculateIncomeTotal(incomes: IncomeClass[] | undefined) {
    let incomeTotal: number = 0

    if (incomes === undefined) {
        return (incomeTotal);
    } else {
        for (const income of incomes) {
            incomeTotal = incomeTotal + income.amount
        }
    }

    return (incomeTotal);
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function calculateTransactionTotal(transactions: TransactionClass[] | undefined) {
    let transactionTotal: number = 0

    if (transactions === undefined) {
        return (transactionTotal);
    } else {
        for (const transaction of transactions) {
            transactionTotal = transactionTotal + transaction.value
        }
    }

    return (transactionTotal);
}