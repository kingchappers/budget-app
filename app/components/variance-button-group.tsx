"use client"

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getTransactionsBetweenDatesAction } from '../_transactionActions';
import { calculateTransactionTotalAction } from '../_targetActions';
import { useState } from "react";

export default function timeButton() {
  React.useEffect(() => {
    setTable("week")
  },[])
  const [timeTotal, setTimeTotal] = useState(0);
  const [alignment, setAlignment] = React.useState('week');
  var transactionTotal = 0

  // setTable("week")

  async function setTable(value: string){
    if(value === "week"){
      let endDate = new Date();
      const startDate = new Date(endDate.setDate(endDate.getDate() - 7));
      endDate = new Date()
      const {transactions, results} = await getTransactionsBetweenDatesAction({startDate, endDate})
      transactionTotal = await calculateTransactionTotalAction({transactions, results}) ?? 0
    } else if(value === "month"){
      const date = new Date();
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const {transactions, results} = await getTransactionsBetweenDatesAction({startDate, endDate})
      transactionTotal = await calculateTransactionTotalAction({transactions, results}) ?? 0
    } else if(value === "year"){
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, 0, 1);
      const endDate = new Date(currentYear, 11, 31);
      const {transactions, results} = await getTransactionsBetweenDatesAction({startDate, endDate})
      transactionTotal = await calculateTransactionTotalAction({transactions, results}) ?? 0
    } else {
      transactionTotal = 0;
    }

  setTimeTotal(transactionTotal);
  }

  async function handleChange (
    event: React.MouseEvent<HTMLElement>,
    value: string,
  ) {
    setAlignment(value);
    setTable(value)
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

        <p>£{timeTotal}</p>


        <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="w-10"></th>
                        <th className="pl-5 text-center w-44">Target</th>
                        <th className="px-5 text-center w-44">Actual Spending</th>
                        <th className="px-5 text-center w-44">Difference</th>
                    </tr>
                </thead>  
                <tr className="">
                    <td className="text-right font-bold">Expenses:</td>
                    <td className="text-center">£{targetMonthlyExpenseTotal.toFixed(2)}</td> 
                    <td className="text-center">£{actualMonthyExpensesTotal.toFixed(2)}</td>
                    <td className={ expenseDifferenceColor }>£{expenseDifference.toFixed(2)}</td>
                </tr>
                <tr className="">
                    <td className="text-right font-bold">Income:</td>
                    <td className="text-center">£{targetMonthlyIncomeTotal.toFixed(2)}</td>
                    <td className="text-center">£{actualMonthlyIncomeTotal.toFixed(2)}</td>
                    <td className={ incomeDifferenceColor }>£{incomeDifference.toFixed(2)}</td>
                </tr>
                <tr className="">
                    <td className="text-right font-bold">Savings:</td>
                    <td className="text-center">£{impliedMonthlySaving.toFixed(2)}</td>
                    <td className="text-center">£{actualMonthlySaving.toFixed(2)}</td>
                    <td className={ savingDifferenceColor }>£{savingDifference.toFixed(2)}</td>
                </tr>
            </table>
    </div>
  );
}