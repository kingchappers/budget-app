"use client"

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getTransactionsBetweenDatesAction } from '../_transactionActions';
import { calculateTransactionTotalAction, getTargetsAction } from '../_targetActions';
import { useState } from "react";
import { calculateDifference } from './target-calculation-functions';
import { getIncomesBetweenDatesAction } from '../_incomeActions';
import differenceInDays from 'date-fns/differenceInDays';

let didInit = false;

interface targetItem {
    targetName: string;
    targetValue: number;
    targetType: boolean;
    actualValue: number;
    difference: number;
}

var targetItems: targetItem[] = []

export default function varianceTimeButton() {
    React.useEffect(() => {
        //The if checks if the page has already initialised and stops it running twice
        if (!didInit) {
            didInit = true;
            setTable("week")
        }
    }, [])


    const [timeTransactionTotal, setTimeTransactionTotal] = useState(0);
    const [statefulTarget, setStatefulTarget] = useState(targetItems);
    const [alignment, setAlignment] = React.useState('week');
    var transactionTotal = 0;

    async function setTargetItems(startDate: Date, endDate: Date) {
        targetItems = []
        // let endDate = new Date();
        // const startDate = new Date(endDate.setDate(endDate.getDate() - 7));
        // endDate = new Date()

        var { transactions, results: transactionResults } = await getTransactionsBetweenDatesAction({ startDate, endDate });
        var { targets, results: targetResults } = await getTargetsAction();
        var { incomes, results: incomeResults } = await getIncomesBetweenDatesAction({ startDate, endDate})

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
            const index: number = targetItems.findIndex((targetItem) => { return targetItem.targetName === transaction.category && targetItem.targetType === true})
            targetItems[index].actualValue = targetItems[index].actualValue + transaction.value;
        })

        incomes?.forEach((income) => {
            const index: number = targetItems.findIndex((targetItem) => { return targetItem.targetName === income.incomeCategory && targetItem.targetType === false})
            targetItems[index].actualValue = targetItems[index].actualValue + income.amount;
        })

        targetItems?.forEach((targetItem) => {
            if(targetItem.targetType){
                targetItem.difference = calculateDifference(targetItem.actualValue, targetItem.targetValue)
            } else {
                targetItem.difference = calculateDifference(targetItem.targetValue, targetItem.actualValue)
            }
        })

        setStatefulTarget(targetItems)
    }

    async function setTable(value: string) {
        var startDate = new Date()
        var endDate = new Date()

        if (value === "week") {
            endDate = new Date();
            startDate = new Date(endDate.setDate(endDate.getDate() - 7));
            endDate = new Date()
            const { transactions, results } = await getTransactionsBetweenDatesAction({ startDate, endDate })
            transactionTotal = await calculateTransactionTotalAction({ transactions, results }) ?? 0
        } else if (value === "month") {
            const date = new Date();
            startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const { transactions, results } = await getTransactionsBetweenDatesAction({ startDate, endDate })
            transactionTotal = await calculateTransactionTotalAction({ transactions, results }) ?? 0
        } else if (value === "year") {
            const currentYear = new Date().getFullYear();
            startDate = new Date(currentYear, 0, 1);
            endDate = new Date(currentYear, 11, 31);
            const { transactions, results } = await getTransactionsBetweenDatesAction({ startDate, endDate })
            transactionTotal = await calculateTransactionTotalAction({ transactions, results }) ?? 0
        } else {
            transactionTotal = 0;
        }

        setTimeTransactionTotal(transactionTotal);
        setTargetItems(startDate, endDate)
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

            <p>£{timeTransactionTotal}</p>

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
                    <tbody>
                        {targetItems.length < 0 ? (
                            <tr>
                                <td className="text-center font-bold" colSpan={5}>No Targets Found!</td>
                            </tr>
                        ) : (
                            targetItems?.map((targetItem) => (
                                targetItem.targetType === true ? (
                                    <tr key={targetItem.targetName + targetItem.targetType} className="divide-y-2">
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
                    <tbody>
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

            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-10"></th>
                        <th className="pl-5 text-center w-44">Target Value:</th>
                        <th className="px-5 text-center w-44">Actual Spending</th>
                        <th className="px-5 text-center w-44">Difference</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="">
                        <td className="text-right font-bold">TargetName:</td>
                        <td className="text-center">£0</td>
                        <td className="text-center">£0</td>
                        <td className="{ expenseDifferenceColor }">£0</td>
                    </tr>
                    <tr className="">
                        <td className="text-right font-bold">Income:</td>
                        <td className="text-center">£0</td>
                        <td className="text-center">£0</td>
                        <td className="{ expenseDifferenceColor }">£0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}