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
            <Datetime dateFormat="DD/MM/YYYY" inputProps={inputProps} initialValue={new Date()} timeFormat={false} className="bg-white border rounded px-1 py-1 flex-1" /> {/* w-28"/>  */}
        </div>
    )
}
