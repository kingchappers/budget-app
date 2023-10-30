import { getServerSession } from "next-auth";
import { SavingForm } from "../components/savings-form-server";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";


export default async function Savings() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">
            <h1 className="text-3xl font-bold mb-4">Savings</h1>
            <SavingForm userId={userId}/>

        </div>
    );
}