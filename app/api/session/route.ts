import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  console.log("__________________________________________________")
  console.log(session?.user?.id)

  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}