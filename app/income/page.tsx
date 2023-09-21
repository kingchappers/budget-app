import IncomeFormServerComponent from "../components/income-form-server";
import IncomeItemServerComponent from "../components/income-item-server";
import { getCategories } from "../lib/categories-db";
import { getIncomes } from "../lib/income-db";
import { CategoryClass } from "../models/Category";

// type CategoriesComboProps = {
//     categories: CategoryClass;
//   };

export default async function Home() {
    const { incomes, results } = await getIncomes();
    const categories = await getCategories();

    // const categoryList = [];
    //     for (const category of categories) {
    //         const newCategory = {
    //             id: category._id,
    //             label: category.label,
    //         }

    //         categoryList.push(newCategory)
    //     }

    const listOfCategories = categories.categories
    console.log("This is from the pages file")
    // console.log(categories.categories)
    // console.log(typeof categories.categories)

    console.log("this is the test variable")
    console.log(listOfCategories.length)
    if(listOfCategories?.length){
        console.log(listOfCategories[1]) 
    }
    //console.log(listOfCategories[0])

    // console.log(categoryList)
    // console.log(typeof categoryList)

    return(
        <div className="container mx-auto max-w-screen-2xl p-4">

            <IncomeFormServerComponent categories={listOfCategories} />
            {/* <IncomeFormServerComponent/> */}

            <h1 className="text-2xl font-bold mb-4">Income List</h1>
            <table className="divide-y-2 table-fixed">
                <thead>
                    <tr className="text-left text-1xl">
                        <th className="px-5 w-10">Date</th>
                        <th className="px-5 w-52">Company</th>
                        <th className="px-5 w-24">Amount</th>
                        <th className="px-5 w-48">Category</th>
                        <th className="px-5 w-80">Notes</th>
                    </tr>
                </thead>       

            {results === 0 ? (
                <p className="text-center">No Incomes Found</p>
            ) : (
                incomes?.map((income) => (
                    <IncomeItemServerComponent key={income.id} income={income} />
                ))
            )}

            </table>
        </div>
        
    );
}