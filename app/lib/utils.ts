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

export function stringToDate(dateString: string) {
    const date: Date = parse(dateString, "dd/MM/yyyy", new Date(), { locale: enGB })

    return (date)
}

export function dateToString(date: Date) {
    const dateString = format(date, "dd/MM/yyyy")

    return dateString
}

export function getMonthsBetweenDates(startDate: Date, endDate: Date) {
    const months: Date[] = [];

    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    while (currentDate <= endDate) {
        months.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    console.log(months)
    return months;
}

export function getLastTwelveMonths() {
    const endDate = new Date;
    const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
    const monthsBetweenDates = getMonthsBetweenDates(startDate, endDate);
    return monthsBetweenDates;
}