import connectDB from "@/app/lib/mongoose-connect-db";
import { createTransaction, getTransactions } from "@/app/lib/transaction-db";
import { createErrorResponse } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const page_str = request.nextUrl.searchParams.get("page");
        const limit_str = request.nextUrl.searchParams.get("limit");
        const userId_str = request.nextUrl.searchParams.get("userId");

        const page = page_str ? parseInt(page_str, 10) : 1;
        const limit = limit_str ? parseInt(limit_str, 10) : 10;
        const userId = userId_str ?? "unknown";

        const { transactions, results, error } = await getTransactions({ page, limit, userId });

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

        if (!body.transactionDate) {
            return createErrorResponse("Transaction must have a transactions date", 400);
        }

        if (!body.vendor) {
            return createErrorResponse("Transaction must have a vendor", 400);
        }

        if (!body.value) {
            return createErrorResponse("Transaction must have a value", 400);
        }

        if (!body.category) {
            return createErrorResponse("Transaction must have a catagory", 400);
        }

        if (!body.items) {
            return createErrorResponse("Transaction must have a item or empty string", 400);
        }

        if (!body.notes) {
            return createErrorResponse("Transaction must have a notes or empty string", 400);
        }

        if (!body.vendor) {
            return createErrorResponse("Transaction must have a userId", 400);
        }

        const { transaction, error } = await createTransaction(body.transactionDate, body.vendor, body.value, body.category, body.items, body.notes, body.userId);
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