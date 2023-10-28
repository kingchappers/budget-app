"use client"

import React from "react"
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css"

export function DatePicker() {
    let inputProps = {
        name: 'pickedDate',
        size: 9,
    };

    return (
        <div>
            <Datetime dateFormat="DD/MM/YYYY" inputProps={inputProps} initialValue={new Date()} timeFormat={false} className="bg-white border rounded px-1 py-1 flex-1" />
        </div>
    )
}

export function BetweenTwoDates() {
    let startDateInputProps = {
        name: 'startDate',
        size: 8,
    };

    let endDateInputProps = {
        name: 'endDate',
        size: 8,
    };

    const defaultStartDate = new Date()
    const test = new Date()

    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return (
        <div className="flex items-center">
            <Datetime dateFormat="DD/MM/YYYY" inputProps={startDateInputProps} initialValue={startDate} timeFormat={false} className="bg-white border rounded px-1 py-1 ml-5" />
            <p className="mx-2"> to </p>
            <Datetime dateFormat="DD/MM/YYYY" inputProps={endDateInputProps} initialValue={endDate} timeFormat={false} className="bg-white border rounded px-1 py-1" />
        </div>
    )
}
