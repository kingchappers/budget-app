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