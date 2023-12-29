"use client"

import { useState } from "react";

export function SplitBill() {
    const [total, setTotal] = useState(0);

    async function action(data: FormData) {

        const cost = Number(data.get("cost"));
        if (!cost || typeof cost !== "number") {
            return;
        }

        const numberOfPeople = Number(data.get("numberOfPeople"));
        if (!numberOfPeople || typeof numberOfPeople !== "number") {
            return;
        }

        setTotal(cost / numberOfPeople);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Bill Splitter</h1>

            <form action={action} key={Math.random()} className="flex items-center space-x-3 mb-4">
                <input autoComplete="off" type="number" step="any" name="cost" placeholder="Cost" className="border rounded px-1 py-1 w-52" />
                <input autoComplete="off" type="number" name="numberOfPeople" placeholder="Number of People" className="border rounded px-1 py-1 w-52" />
                <button className="px-4 py-1 text-white rounded bg-green-500">Split</button>
            </form>

            <div className="flex font-bold">
                <p>Each of you will pay: </p>
                <p className="pl-5">£{total.toFixed(2)}</p>
            </div>
        </div>
    );
}