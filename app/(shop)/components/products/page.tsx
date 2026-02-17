import { getCategories } from "@/lib/items"
import { ItemType } from "@/app/(admin)/admin/type/items";
import ProductCard from "../productCard/productCard";

export const metadata = {
    title: 'Products',
    description: 'Browse our product catalog'
}

export default async function Products() {
    const categories = await getCategories();

    if (!categories.length) return;

    const displayCategories = categories.map(cat => <div key={cat._id}
                                className="w-full h-full flex flex-col justify-center items-center spacey-4 my-10">
        <h2 className="text-2xl font-light tracking-wider uppercase text-gray-500">
            {cat.name}
        </h2>

        <div className="w-full my-[50px] grid place-items-center gap-y-20
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-2
                        lg:grid-cols-3">
            {
                cat.items.map((itm:ItemType, idx:number) => <ProductCard key={idx} product={itm}/>)
            }
        </div>
    </div>
    )

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-10 p-3">
            {
                displayCategories
            }
        </div>
    )
}
