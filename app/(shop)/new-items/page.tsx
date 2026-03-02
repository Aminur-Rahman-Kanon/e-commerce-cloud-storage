import { getNewItems } from "@/lib/items";
import CategoriesCard from "../components/categoriesCard/categoriesCard";
import CategoriesItemCard from "../components/categoriesItemCard/categoriesItemCard";

export default async function Page () {
    const category = await getNewItems();
    
    if (!category) return;

    console.log(category)

    return (
        <div className="w-full max-w-[1800px] min-h-screen mx-auto my-10 p-5 flex flex-col justify-start items-start gap-y-[50px]">
            <h1 className="text-2xl text-gray-600 font-semibold
                            md:text-4xl">
                What's New
            </h1>
            <div className="w-full h-full grid grid-cols-[1fr]
                            lg:grid grid-cols-[300px,1fr]">
                <div className="w-full h-full">
                    <CategoriesCard />
                </div>
                <div className="w-full h-full space-y-5">
                    {
                        category.map(cat => <div key={cat._id} className="w-full flex flex-col justify-start items-start gap-y-5">
                            <h2 className="text-2xl text-gray-600 capitalize">
                                {cat.name}
                            </h2>
                            <CategoriesItemCard items={cat.items} />
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}