import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

type User = {
    id: number;
    name: string;
    email: string;
};

export default async function Profile() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const name = session.user.name;
    const email = session.user.email;

    return (
        <main>
            <div>
                <h1 className="text-4xl font-extrabold">Welcome to your profile page {name}!</h1>
                <h1 className="text-4xl font-extrabold mb-5">Your current email address is {email}</h1>
            </div>
        </main>
    );
}
