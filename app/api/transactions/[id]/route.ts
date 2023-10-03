import connectDB from "@/app/lib/connect-db";
import { deleteTransaction, getTransaction, updateTransaction } from "@/app/lib/transaction-db";
import { createErrorResponse } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const id = params.id;
        const { transaction, error } = await getTransaction(id);

        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            data: {
                transaction,
            },
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        if (typeof error === "string" && error.includes("Transaction not found")) {
            return createErrorResponse("Transaction not found", 404);
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

        const { transaction, error } = await updateTransaction(id, body);

        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            data: {
                transaction,
            },
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        if (typeof error === "string" && error.includes("Transaction not found")) {
            return createErrorResponse("Transaction not found", 404);
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
        const { error } = await deleteTransaction(id)

        if (error) {
            throw error;
        }

        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        if (typeof error === "string" && error.includes("Transaction not found")) {
            return createErrorResponse("Transaction not found", 404);
        }
        return createErrorResponse(error.message, 500);
    }
}