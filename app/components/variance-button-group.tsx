"use client"

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getTransactionsBetweenDatesAction } from '../_transactionActions';
import { calculateTransactionTotalAction, getTargetsAction } from '../_targetActions';
import { useState } from "react";
import VarianceTable from "./variance-table-server"

export default function timeButton() {
  React.useEffect(() => {
    setTable("week")
    setTargetItems()
  },[])

  interface targetItem {
    targetName?: string;
    targetValue?: number;
    actualSpent?: number;
  }

  const [timeTransactionTotal, setTimeTransactionTotal] = useState(0);
  const [alignment, setAlignment] = React.useState('week');
  var targetList: targetItem = {}
  const [targetListItem, setTargetListItem] = useState(targetList)
  var transactionTotal = 0

  async function setTargetItems() {
    let endDate = new Date();
    const startDate = new Date(endDate.setDate(endDate.getDate() - 7));
    endDate = new Date()
    var tests: targetItem[] = []

    var { transactions, results: transactionResults} = await getTransactionsBetweenDatesAction({startDate, endDate})
    var { targets, results: targetResults } = await getTargetsAction()

    // console.log(transactions?.find((transaction) => {return transaction.category === "Childcare"}))
    
    targets?.forEach((target) => {
      // console.log(target.categoryName)
      // console.log(target.expenseTarget)
      // console.log(target.targetAmount)

      const newItem: targetItem = {
        targetName: target.categoryName,
        targetValue: target.targetAmount,
        actualSpent: 0
      }

      tests.push(newItem)
    })

    console.log("this is the test variable:" + tests)

    transactions?.forEach((transaction) => {
      console.log(transaction.category)
      const foo = tests.find((test) => {return test.targetName === transaction.category})
      const index = tests.findIndex((test) => {return test.targetName === transaction.category})
      console.log(foo)
      console.log(index)

      tests[index].actualSpent = tests[index].actualSpent + transaction.value

      console.log(tests[index])
    })

    
    
  //   {results === 0 ? (
  //     <p className="text-center">No Transactions Found</p>
  // ) : (
  //     transactions?.map((transaction) => (
  //         <TransactionItemServerComponent key={transaction.id} transaction={transaction} />
  //     ))
  // )}
    

  //   data.forEach((value, key) => {
  //     if(!value || typeof Number(value) !== "number"){
  //         return;
  //     }
      
  //     updateTargetAction(key, {targetAmount: Number(value)}, "/with-server-actions")
  // });

  }

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

    setTimeTransactionTotal(transactionTotal);
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

        <p>£{timeTransactionTotal}</p>

        <table className="divide-y-2 table-fixed">
          <thead>
            <tr className="text-left text-1xl">
              <th className="w-10"></th>
              <th className="pl-5 text-center w-44">Target Value</th>
              <th className="px-5 text-center w-44">Actual Spending</th>
              <th className="px-5 text-center w-44">Difference</th>
            </tr>

            {/* <VarianceTable transactions={tranactions} /> */}
          </thead>
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