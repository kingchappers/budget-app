"use client"

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getTransactionsBetweenDatesAction } from '../_transactionActions';
import { calculateTransactionTotalAction, getTargetsAction } from '../_targetActions';
import { useState } from "react";
import TargetItem from './target-form-server';

let didInit = false;

interface targetItem {
    targetName: string;
    targetValue: number;
    targetType: boolean;
    actualValue: number;
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
    const [alignment, setAlignment] = React.useState('week');
    var transactionTotal = 0

    const [test, setTest] = useState(targetItems)

    async function setTargetItems() {
        targetItems = []
        console.log(targetItems)
        let endDate = new Date();
        const startDate = new Date(endDate.setDate(endDate.getDate() - 7));
        endDate = new Date()

        var { transactions, results: transactionResults } = await getTransactionsBetweenDatesAction({ startDate, endDate })
        var { targets, results: targetResults } = await getTargetsAction()

        // console.log(transactions?.find((transaction) => {return transaction.category === "Childcare"}))

        targets?.forEach((target) => {
            // console.log(target.categoryName)
            // console.log(target.expenseTarget)
            // console.log(target.targetAmount)

            const newItem: targetItem = {
                targetName: target.categoryName,
                targetValue: target.targetAmount,
                targetType: target.expenseTarget,
                actualValue: 0
            }

            targetItems.push(newItem)
        })

        // console.log("this is the test variable:" + targetItems)

        transactions?.forEach((transaction) => {
            // console.log(transaction.category)
            const foo = targetItems.find((targetItem) => { return targetItem.targetName === transaction.category })
            const index: number = targetItems.findIndex((targetItem) => { return targetItem.targetName === transaction.category })
            // console.log(foo)
            // console.log(index)

            targetItems[index].actualValue = targetItems[index].actualValue + transaction.value

            console.log("boo")
            console.log(targetItems.length)

        })

        setTest(targetItems)

        // console.log(test)

    }

    async function setTable(value: string) {
        if (value === "week") {
            let endDate = new Date();
            const startDate = new Date(endDate.setDate(endDate.getDate() - 7));
            endDate = new Date()
            const { transactions, results } = await getTransactionsBetweenDatesAction({ startDate, endDate })
            transactionTotal = await calculateTransactionTotalAction({ transactions, results }) ?? 0
        } else if (value === "month") {
            const date = new Date();
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const { transactions, results } = await getTransactionsBetweenDatesAction({ startDate, endDate })
            transactionTotal = await calculateTransactionTotalAction({ transactions, results }) ?? 0
        } else if (value === "year") {
            const currentYear = new Date().getFullYear();
            const startDate = new Date(currentYear, 0, 1);
            const endDate = new Date(currentYear, 11, 31);
            const { transactions, results } = await getTransactionsBetweenDatesAction({ startDate, endDate })
            transactionTotal = await calculateTransactionTotalAction({ transactions, results }) ?? 0
        } else {
            transactionTotal = 0;
        }

        setTimeTransactionTotal(transactionTotal);
        setTargetItems()
        console.log("hello")
        console.log(targetItems.length)
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
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-44"></th>
                        <th className="pl-5 text-center w-44">Target Value</th>
                        <th className="px-5 text-center w-44">Actual Spending</th>
                        <th className="px-5 text-center w-44">Difference</th>
                    </tr>
                </thead>

                {targetItems.length < 0 ? (
                    <p> nothing found</p>
                ) : (
                    targetItems?.map((targetItem) => (
                        targetItem.targetType === true ? (
                        <tr key={targetItem.targetName + targetItem.targetType}>
                            <td className="text-right font-bold">{targetItem.targetName}:</td>
                            <td className="text-center">£{targetItem.targetValue.toFixed(2)}</td>
                            <td className="text-center">£{targetItem.actualValue.toFixed(2)}</td>
                            <td className="text-center">£Insert Difference Calculation here</td>
                        </tr>
                        ) : (
                            ""
                        )
                    ))
                )}

            </table>

            <h1 className="text-2xl font-bold mt-5 mb-3">Monthly Income Variance</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-44"></th>
                        <th className="pl-5 text-center w-44">Target Value</th>
                        <th className="px-5 text-center w-44">Actual Income</th>
                        <th className="px-5 text-center w-44">Difference</th>
                    </tr>
                </thead>

                {targetItems.length < 0 ? (
                    <p> nothing found</p>
                ) : (
                    targetItems?.map((targetItem) => (
                        targetItem.targetType === false ? (
                        <tr key={targetItem.targetName + targetItem.targetType}>
                            <td className="text-right font-bold">{targetItem.targetName}:</td>
                            <td className="text-center">£{targetItem.targetValue.toFixed(2)}</td>
                            <td className="text-center">£{targetItem.actualValue.toFixed(2)}</td>
                            <td className="text-center">£Insert Difference Calculation here</td>
                        </tr>
                        ) : (
                            ""
                        )
                    ))
                )}

            </table>

            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-10"></th>
                        <th className="pl-5 text-center w-44">Target Value:</th>
                        <th className="px-5 text-center w-44">Actual Spending</th>
                        <th className="px-5 text-center w-44">Difference</th>
                    </tr>
                </thead>
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
            </table>
        </div>
    );
}