import { VarianceTimeButton } from "../components/variance-button-group"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id
    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-3xl font-bold mb-4">This page is not operational. The logic requires a complete rework as there is a calculation bug in figuring out the time between two months</h1>
            {/* <VarianceTimeButton userId={userId} /> */}

        </div>
    );
}