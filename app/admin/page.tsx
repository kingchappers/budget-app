import { DefaultCategoriesButton } from "../components/admin-components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">
            <DefaultCategoriesButton userId={userId}/>
        </div>
    );
}