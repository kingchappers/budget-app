"use client"

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getTransactionsBetweenDatesAction } from '../_transactionActions';
import { TransactionFilter } from '../lib/transaction-db';
import { calculateTransactionTotalAction } from '../_targetActions';

export default function ColorToggleButton() {
  const [alignment, setAlignment] = React.useState('web');

  async function handleChange (
    event: React.MouseEvent<HTMLElement>,
    value: string,
  ) {
    setAlignment(value);

    if(value === "week"){
        let endDate = new Date();
        const startDate = new Date(endDate.setDate(endDate.getDate() - 7));
        endDate = new Date()
        const {transactions, results} = await getTransactionsBetweenDatesAction({startDate, endDate})
        let total = await calculateTransactionTotalAction({transactions, results}) 
        console.log(total)
        // return(total);
    } else if(value === "month"){
        const date = new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const {transactions, results} = await getTransactionsBetweenDatesAction({startDate, endDate})
        const total = await calculateTransactionTotalAction({transactions, results})
        console.log(total)
        // return(total);
    } else if(value === "year"){
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
        const {transactions, results} = await getTransactionsBetweenDatesAction({startDate, endDate})
        const total = await calculateTransactionTotalAction({transactions, results})
        console.log(total)
        // return(total);
    } else {
        const total = 0;
        console.log(total)
        // return(total);
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
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
        <ToggleButton value="year">Year</ToggleButton>
        </ToggleButtonGroup>

        <p></p>
    </div>
  );
}