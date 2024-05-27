"use client"

import React, { Dispatch, SetStateAction } from "react"
import { dateToStringInputFormat, stringToDate, stringToDateInputFormat } from "../lib/utils"

interface DatePickerProps {
    initialDate?: Date,
    selectedDate?: Date,
    setSelectedDate?: Dispatch<SetStateAction<Date>>
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

// export function DatePicker({ initialDate, selectedDate, setSelectedDate }: DatePickerProps) {
//     initialDate = initialDate ?? new Date()
//     const inputInitialDate = dateToStringInputFormat(initialDate ?? new Date)
//     let inputProps = {
//         name: 'pickedDate',
//         size: 7,
//     };

//     function setDateSelection(value: string | Date) {
//         if (setSelectedDate) {
//             if (value) {
//                 if (typeof (value) == 'string') {
//                     const valueAsDate = stringToDateInputFormat(value);
//                     setSelectedDate(valueAsDate)
//                 } else if (typeof (value) == 'object') {
//                     const valueAsDate = value;
//                     setSelectedDate(valueAsDate)
//                 }
//             }
//         }
//     }

//     return (
//         <div>
//             {/* <Datetime dateFormat="DD/MM/YYYY" inputProps={inputProps} initialValue={initialDate} timeFormat={false} onChange={(value) => setDateSelection(value)} className="bg-white border rounded px-0 lg:px-1 py-1 w-28" /> */}
//             <input aria-label="Date" type="date" name="pickedDate" pattern="dd/mm/yyyy" defaultValue={inputInitialDate} className="border rounded px-1 py-1 w-24 lg:w-44"/> {/* value="2024-05-23" */}
//         </div>
//     )
// }

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

// export function BetweenTwoDates() {
//     let startDateInputProps = {
//         name: 'startDate',
//         size: 8,
//     };

//     let endDateInputProps = {
//         name: 'endDate',
//         size: 8,
//     };

//     const date = new Date();
//     const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
//     const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//     return (
//         <div className="flex items-center">
//             <Datetime dateFormat="DD/MM/YYYY" inputProps={startDateInputProps} initialValue={startDate} timeFormat={false} className="bg-white border rounded px-1 py-1 ml-5" />
//             <p className="mx-2"> to </p>
//             <Datetime dateFormat="DD/MM/YYYY" inputProps={endDateInputProps} initialValue={endDate} timeFormat={false} className="bg-white border rounded px-1 py-1" />
//         </div>
//     )
// }
