import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { parse, format } from "date-fns"
import { enGB } from "date-fns/locale";

export function stringToObjectId(id: string): mongoose.Types.ObjectId | null {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    } else {
        return null
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function createErrorResponse(
    message: string,
    statusCode: number
): NextResponse {
    const errorResponse = {
        status: statusCode >= 500 ? "error" : "fail",
        message,
    };

    return new NextResponse(JSON.stringify(errorResponse), {
        status: statusCode,
        headers: { "Contetn-Type": "application/json" },
    });
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function stringToDate(dateString: string) {
    try {
        const date: Date = parse(dateString, "dd/MM/yyyy", new Date(), { locale: enGB })
        return (date)
    } catch (err) {
        console.log(err)
        console.log("The stringToDate function went wrong")
        // const date: Date = parse(dateString, "dd/MM/yyyy", new Date(), { locale: enGB })
        return (new Date("2025-01-15"))
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function stringToDateInputFormat(dateString: string) {
    try {
        const date: Date = parse(dateString, "yyyy-MM-dd", new Date(), { locale: enGB })

        return (date)
    } catch (err) {
        console.log(err)
        console.log("The stringToDateInputFormat function went wrong")
        // const date: Date = parse(dateString, "yyyy-MM-dd", new Date(), { locale: enGB })
        return (new Date("2026-02-16"))
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function dateToString(date: Date) {
    // console.log(date)
    // console.log(typeof(date))

    try {
        const dateString = format(date, "dd/MM/yyyy")
        // console.log("worked")
        return dateString
    } catch (err) {
        console.log(err)
        console.log("The dateToString function went wrong")
        const dateString = "17/03/2027"
        return dateString
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function dateToStringInputFormat(date: Date) {
    try {
        const dateString = format(date, "yyyy-MM-dd")

        return dateString
    } catch (err) {
        console.log(err)
        console.log("The dateToStringInputFormat function went wrong")
        const dateString = format(date, "2028-04-18")
        return dateString
    }
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function getMonthsBetweenDates(startDate: Date, endDate: Date) {
    const months: Date[] = [];

    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    while (currentDate <= endDate) {
        months.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

export function getLastTwelveMonths() {
    const endDate = new Date;
    const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), 1);
    const monthsBetweenDates = getMonthsBetweenDates(startDate, endDate);
    return monthsBetweenDates;
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________

export function twelveMonthsInOrder() {
    const lastTwelveMonths = getLastTwelveMonths()
    var dateOrder: string[] = [];
    const monthPromises = lastTwelveMonths.map((month) => {
        const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
        dateOrder.push(monthAsString);
    })
    return dateOrder;
}

// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________________________________________________________