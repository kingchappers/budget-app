import { CategoryForm } from "../components/category-form-server";
import { CategoryItem } from "../components/category-item-server";
import { getCategories, CategoryFilter } from "../lib/categories-db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    const userId = session.user.id;

    let filter: CategoryFilter = {
        limit: 0,
        userId: session.user.id
    }

    const { categories, results } = await getCategories(filter);

    return (
        <div>
            <CategoryForm userId={userId} />

            <h1 className="text-2xl font-bold mb-4">Income List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left">
                        <th className="px-3 w-36 lg:px-5 lg:w-44">Category</th>
                        <th className="px-3 w-5 lg:px-5 lg:w-52">Transaction Category</th>
                        <th className="px-3 w-5 lg:px-5 lg:w-48">Income Category</th>
                    </tr>
                </thead>

                {results === 0 ? (
                    <p className="text-center">No Categories Found</p>
                ) : (
                    categories?.map((category) => (
                        <CategoryItem key={category.id} category={category} userId={userId}/>
                    ))
                )}
            </table>
        </div>

    );
}