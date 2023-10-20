"use client"

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getTransactionsBetweenDatesAction } from '../_transactionActions';
import { calculateIncomeTotalAction, calculateTargetsTotalAction, calculateTransactionTotalAction, getTargetsAction } from '../_targetActions';
import { useState } from "react";
import { calculateDifference, calculateIncomeTotal } from './target-calculation-functions';
import { getIncomesBetweenDatesAction } from '../_incomeActions';
import differenceInDays from 'date-fns/differenceInDays';
import { TargetFilter } from '../lib/target-db';

let didInit = false;

interface targetItem {
    targetName: string;
    targetValue: number;
    targetType: boolean;
    actualValue: number;
    difference: number;
}

var targetItems: targetItem[] = []

export function VarianceTimeButton() {
    React.useEffect(() => {
        //The if checks if the page has already initialised and stops it running twice
        if (!didInit) {
            didInit = true;
            setTable("month")
        }
    }, [])


    const [timeTransactionTotal, setTimeTransactionTotal] = useState(0);
    const [timeIncomeTotal, setTimeIncomeTotal] = useState(0);
    const [statefulTarget, setStatefulTarget] = useState(targetItems);
    const [alignment, setAlignment] = useState('month');
    const [targetExpenses, setTargetExpenses] = useState(0);
    const [targetIncome, setTargetIncome] = useState(0);
    const [expenseDifference, setExpenseDifference] = useState(0);
    const [incomeDifference, setIncomeDifference] = useState(0);
    const [impliedSavings, setImpliedSavings] = useState(0)
    const [actualSavings, setActualSavings] = useState(0)
    const [savingDifference, setSavingDifference] = useState(0)
    const [expenseDifferenceColour, setExpenseDifferenceColour] = useState("")
    const [incomeDifferenceColour, setIncomeDifferenceColour] = useState("")
    const [savingDifferenceColour, setSavingDifferenceColour] = useState("")

    var transactionTotal = 0;
    var incomeTotal = 0;
    var expenseTargetsTotal = 0
    var incomeTargetsTotal = 0

    async function setTargetItems(startDate: Date, endDate: Date) {
        targetItems = []

        var { transactions, results: transactionResults } = await getTransactionsBetweenDatesAction({ startDate, endDate });
        var { targets, results: targetResults } = await getTargetsAction({});
        var { incomes, results: incomeResults } = await getIncomesBetweenDatesAction({ startDate, endDate })

        const daysBetween = differenceInDays(endDate, startDate)

        targets?.forEach((target) => {
            const newItem: targetItem = {
                targetName: target.categoryName,
                targetValue: (target.targetAmount / 30) * daysBetween,
                targetType: target.expenseTarget,
                actualValue: 0,
                difference: 0
            }
            targetItems.push(newItem)
        })

        transactions?.forEach((transaction) => {
            const index: number = targetItems.findIndex((targetItem) => { return targetItem.targetName === transaction.category && targetItem.targetType === true })
            targetItems[index].actualValue = targetItems[index].actualValue + transaction.value;
        })

        incomes?.forEach((income) => {
            const index: number = targetItems.findIndex((targetItem) => { return targetItem.targetName === income.incomeCategory && targetItem.targetType === false })
            targetItems[index].actualValue = targetItems[index].actualValue + income.amount;
        })

        targetItems?.forEach((targetItem) => {
            if (targetItem.targetType) {
                targetItem.difference = calculateDifference(targetItem.actualValue, targetItem.targetValue)
            } else {
                targetItem.difference = calculateDifference(targetItem.targetValue, targetItem.actualValue)
            }
        })

        setStatefulTarget(targetItems)
    }

    async function setTable(value: string) {
        var startDate = new Date();
        var endDate = new Date();
        var daysBetween = 1;

        const targetExpenseFilter: TargetFilter = {
            limit: 50,
            type: "expense"
        }

        const targetIncomeFilter: TargetFilter = {
            limit: 50,
            type: "income"
        }

        if (value === "week") {
            endDate = new Date();
            startDate = new Date(endDate.setDate(endDate.getDate() - 7));
            endDate = new Date();
            setValues(startDate, endDate)
        } else if (value === "month") {
            const date = new Date();
            startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            setValues(startDate, endDate)
        } else if (value === "year") {
            const currentYear = new Date().getFullYear();
            startDate = new Date(currentYear, 0, 1);
            endDate = new Date(currentYear, 11, 31);
            setValues(startDate, endDate)
        } else {
            transactionTotal = 0;
        }
    }

    async function setValues(startDate: Date, endDate: Date) {
        const targetExpenseFilter: TargetFilter = {
            limit: 50,
            type: "expense"
        }
        const targetIncomeFilter: TargetFilter = {
            limit: 50,
            type: "income"
        }

        var daysBetween = differenceInDays(endDate, startDate)
        const { transactions, results: transactionsResults } = await getTransactionsBetweenDatesAction({ startDate, endDate })
        const { incomes, results: incomesResults } = await getIncomesBetweenDatesAction({ startDate, endDate })
        let { targets: expenseTargets, results: expenseResults } = await getTargetsAction(targetExpenseFilter)
        let { targets: incomeTargets, results: incomeResults } = await getTargetsAction(targetIncomeFilter)

        transactionTotal = await calculateTransactionTotalAction({ transactions, transactionsResults }) ?? 0
        incomeTotal = await calculateIncomeTotalAction({ incomes, incomesResults }) ?? 0

        expenseTargetsTotal = await calculateTargetsTotalAction(expenseTargets, expenseResults) ?? 0
        incomeTargetsTotal = await calculateTargetsTotalAction(incomeTargets, incomeResults) ?? 0

        const calculatedExpenseDifference = calculateDifference(transactionTotal, expenseTargetsTotal)
        const calculatedIncomeDifference = calculateDifference(incomeTargetsTotal, incomeTotal)
        const calculatedImpliedSaving = calculateDifference(expenseTargetsTotal, incomeTargetsTotal)
        const calculatedActualMonthlySaving = calculateDifference(transactionTotal, incomeTotal)
        const calculatedSavingDifference = calculateDifference(calculatedImpliedSaving, calculatedActualMonthlySaving)

        setTimeTransactionTotal(transactionTotal);
        setTimeIncomeTotal(incomeTotal)
        setTargetExpenses((expenseTargetsTotal / 30) * daysBetween)
        setTargetIncome((incomeTargetsTotal / 30) * daysBetween)
        setTargetItems(startDate, endDate)
        setExpenseDifference(calculatedExpenseDifference)
        setIncomeDifference(calculatedIncomeDifference)
        setImpliedSavings((calculatedImpliedSaving / 30) * daysBetween)
        setActualSavings(calculatedActualMonthlySaving)
        setSavingDifference(calculatedSavingDifference)
        setExpenseDifferenceColour(textColourClass(expenseDifference))
        setIncomeDifferenceColour(textColourClass(incomeDifference))
        setSavingDifferenceColour(textColourClass(savingDifference))
    }

    async function handleChange(
        event: React.MouseEvent<HTMLElement>,
        value: string,
    ) {
        setAlignment(value);
        setTable(value)
    };

    function textColourClass(value: number) {
        if (value > 0) {
            return "text-center text-green-500"
        } else if (value < 0) {
            return "text-center text-red-500"
        } else {
            return "text-center"
        }
    };

    return (
        <div>
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
            >
                <ToggleButton value="week">Last 7-Days</ToggleButton>
                <ToggleButton value="month">This Month</ToggleButton>
                <ToggleButton value="year">This Year</ToggleButton>
            </ToggleButtonGroup>

            <h1 className="text-2xl font-bold mt-5 mb-3">Overall Targets vs Actuals</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-10"></th>
                        <th className="pl-5 text-center w-44">Target</th>
                        <th className="px-5 text-center w-44">Actual Spending</th>
                        <th className="px-5 text-center w-44">Difference</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2">
                    <tr className="">
                        <td className="text-right font-bold">Expenses:</td>
                        <td className="text-center">£{targetExpenses.toFixed(2)}</td>
                        <td className="text-center">£{timeTransactionTotal.toFixed(2)}</td>
                        <td className={expenseDifferenceColour}>£{expenseDifference.toFixed(2)}</td>
                    </tr>
                    <tr className="">
                        <td className="text-right font-bold">Income:</td>
                        <td className="text-center">£{targetIncome.toFixed(2)}</td>
                        <td className="text-center">£{timeIncomeTotal.toFixed(2)}</td>
                        <td className={incomeDifferenceColour}>£{incomeDifference.toFixed(2)}</td>
                    </tr>
                    <tr className="">
                        <td className="text-right font-bold">Savings:</td>
                        <td className="text-center">£{impliedSavings.toFixed(2)}</td>
                        <td className="text-center">£{actualSavings.toFixed(2)}</td>
                        <td className={savingDifferenceColour}>£{savingDifference.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <h1 className="text-2xl font-bold mt-5 mb-3">Monthly Expense Variance</h1>
            <div className="container flex justify-center">
                <table className="divide-y-2 table-fixed">
                    <thead>
                        <tr className="text-left text-1xl">
                            <th className="w-44"></th>
                            <th className="pl-5 text-center w-44">Target Value</th>
                            <th className="px-5 text-center w-44">Actual Spending</th>
                            <th className="px-5 text-center w-48">Remaining Budget</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2">
                        {targetItems.length < 0 ? (
                            <tr>
                                <td className="text-center font-bold" colSpan={5}>No Targets Found!</td>
                            </tr>
                        ) : (
                            targetItems?.map((targetItem) => (
                                targetItem.targetType === true ? (
                                    <tr key={targetItem.targetName + targetItem.targetType}>
                                        <td className="text-right font-bold">{targetItem.targetName}:</td>
                                        <td className="text-center">£{targetItem.targetValue.toFixed(2)}</td>
                                        <td className="text-center">£{targetItem.actualValue.toFixed(2)}</td>
                                        <td className={textColourClass(targetItem.difference)}>£{targetItem.difference.toFixed(2)}</td>
                                    </tr>
                                ) : (
                                    ""
                                )
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <h1 className="text-2xl font-bold mt-5 mb-3">Monthly Income Variance</h1>
            <div className="container flex justify-center">
                <table className="divide-y-2 table-fixed">
                    <thead>
                        <tr className="text-left text-1xl">
                            <th className="w-44"></th>
                            <th className="pl-5 text-center w-44">Target Value</th>
                            <th className="px-5 text-center w-44">Actual Income</th>
                            <th className="px-5 text-center w-48">Difference</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2">
                        {targetItems.length < 0 ? (
                            <tr>
                                <td className="text-center font-bold" colSpan={5}>No Targets Found!</td>
                            </tr>
                        ) : (
                            targetItems?.map((targetItem) => (
                                targetItem.targetType === false ? (
                                    <tr key={targetItem.targetName + targetItem.targetType}>
                                        <td className="text-right font-bold">{targetItem.targetName}:</td>
                                        <td className="text-center">£{targetItem.targetValue.toFixed(2)}</td>
                                        <td className="text-center">£{targetItem.actualValue.toFixed(2)}</td>
                                        <td className={textColourClass(targetItem.difference)}>£{targetItem.difference.toFixed(2)}</td>
                                    </tr>
                                ) : (
                                    ""
                                )
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}