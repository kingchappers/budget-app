import connectDB from "@/app/lib/connect-db";
import { createIncome, getIncomes } from "@/app/lib/income-db";
import { createErrorResponse } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const page_str = request.nextUrl.searchParams.get("page");
        const limit_str = request.nextUrl.searchParams.get("limit");

        const page = page_str ? parseInt(page_str, 10) : 1;
        const limit = limit_str ? parseInt(limit_str, 10) : 10;

        const { incomes, results, error } = await getIncomes({ page, limit });

        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            results,
            incomes,
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

        if (!body.incomeDate) {
            return createErrorResponse("Incomes must have an income date", 400);
        }

        if (!body.company) {
            return createErrorResponse("Incomes must have a company", 400);
        }

        if (!body.amount) {
            return createErrorResponse("Incomes must have an amount", 400);
        }

        if (!body.incomeCategory) {
            return createErrorResponse("Incomes must have an income category", 400);
        }

        if (!body.notes) {
            return createErrorResponse("Transaction must have a notes or empty string", 400);
        }

        const { income, error } = await createIncome(body.incomeDate, body.company, body.amount, body.incomeCategory, body.notes);
        if (error) {
            throw error;
        }

        let json_response = {
            status: "success",
            data: {
                income,
            },
        };
        return new NextResponse(JSON.stringify(json_response), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error: any) {
        if (error.code === 11000) {
            return createErrorResponse("Income with title already exists", 409);
        }
        return createErrorResponse(error.message, 500);
    }
}