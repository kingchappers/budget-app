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
    </div>
  );
}