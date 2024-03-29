"use client"

import React, { Dispatch, SetStateAction } from "react"
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css"
import { stringToDate } from "../lib/utils"

interface DatePickerProps {
    initialDate?: Date,
    selectedDate?: Date,
    setSelectedDate?: Dispatch<SetStateAction<Date>>
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function DatePicker({ initialDate, selectedDate, setSelectedDate }: DatePickerProps) {
    initialDate = initialDate ?? new Date()
    let inputProps = {
        name: 'pickedDate',
        size: 7,
    };

    function setDateSelection(value: string | moment.Moment) {
        if (setSelectedDate) {
            if (value) {
                if (typeof (value) == 'string') {
                    const valueAsDate = stringToDate(value)
                    setSelectedDate(valueAsDate)
                } else if (typeof (value) == 'object') {
                    const valueAsDate = value.toDate()
                    setSelectedDate(valueAsDate)
                }
            }
        }
    }

    return (
        <div>
            <Datetime dateFormat="DD/MM/YYYY" inputProps={inputProps} initialValue={initialDate} timeFormat={false} onChange={(value) => setDateSelection(value)} className="bg-white border rounded px-0 lg:px-1 py-1 w-28" />
        </div>
    )
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function BetweenTwoDates() {
    let startDateInputProps = {
        name: 'startDate',
        size: 8,
    };

    let endDateInputProps = {
        name: 'endDate',
        size: 8,
    };

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
