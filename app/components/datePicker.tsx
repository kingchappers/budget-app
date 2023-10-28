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

    return (
        <div className="flex items-center">
            <Datetime dateFormat="DD/MM/YYYY" inputProps={startDateInputProps} initialValue={new Date()} timeFormat={false} className="bg-white border rounded px-1 py-1" />
            <Datetime dateFormat="DD/MM/YYYY" inputProps={endDateInputProps} initialValue={new Date()} timeFormat={false} className="bg-white border rounded px-1 py-1" />
        </div>
    )
}
