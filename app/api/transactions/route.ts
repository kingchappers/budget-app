import connectDB from "@/app/lib/connect-db";
import { createTransaction, getTransactions } from "@/app/lib/transaction-db";
import { createErrorResponse } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const page_str = request.nextUrl.searchParams.get("page");
        const limit_str = request.nextUrl.searchParams.get("limit");

        const page = page_str ? parseInt(page_str, 10) : 1;
        const limit = limit_str ? parseInt(limit_str, 10) : 10;

        const { transactions, results, error } = await getTransactions({ page, limit });

        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            results,
            transactions,
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        if (!body.title){
            return createErrorResponse("Transaction must have a title", 400);
        }

        const { transaction, error } = await createTransaction(body.title);
        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            data: {
                transaction,
            },
        };
        return new NextResponse(JSON.stringify(json_response), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        }) 
    } catch (error: any) {
        if (error.code === 11000) {
            return createErrorResponse("Transaction with title already exists", 409);
        }
     return createErrorResponse(error.message, 500);
    }
}