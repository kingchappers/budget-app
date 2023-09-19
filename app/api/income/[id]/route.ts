import connectDB from "@/app/lib/connect-db";
import { deleteIncome, getIncome, updateIncome } from "@/app/lib/income-db";
import { createErrorResponse } from "@/app/lib/utils";
import { create } from "domain";
import { RequestStore } from "next/dist/client/components/request-async-storage";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const id = params.id;
        const { income, error } = await getIncome(id);

        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            data: {
                income,
            },
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        if (typeof error === "string" && error.includes("Income not found")) {
            return createErrorResponse("Income not found", 404);
        }

        return createErrorResponse(error.message, 500)
    }   
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const id = params.id;
        let body = await request.json();

        const { income, error } = await updateIncome(id, body);

        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            data: {
                income,
            },
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        if (typeof error === "string" && error.includes("Income not found")) {
            return createErrorResponse("Income not found", 404);
        }

        return createErrorResponse(error.message, 500);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const id = params.id;
        const { error } = await deleteIncome(id)

        if (error) {
            throw error;
        }

        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        if (typeof error === "string" && error.includes("Income not found")) {
            return createErrorResponse("Income not found", 404);
        }
        return createErrorResponse(error.message, 500);
    }
}