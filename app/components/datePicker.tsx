"use client"

import React, {useState} from "react"
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css"


export default function DatePicker() {
    let inputProps = {
        name: 'pickedDate',
    };

    return (
        <div>
            <Datetime inputProps={ inputProps } initialValue={new Date()} timeFormat={false} className="bg-white border rounded px-1 py-1 flex-1"/>
        </div>
    )
}

//w-60 appearance-none shadow border rounded py-3 px-2 text-gray-darker