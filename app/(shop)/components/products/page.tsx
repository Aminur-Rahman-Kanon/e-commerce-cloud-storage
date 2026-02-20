import { getCategories } from "@/lib/items"
import { ItemType } from "@/app/(admin)/admin/type/items";
import ProductCard from "../productCard/productCard";
import Link from "next/link";

export const metadata = {
    title: 'Products',
    description: 'Browse our product catalog'
}

export default async function Products() {
    const categories = await getCategories();

    if (!categories.length) return;

    const displayCategories = categories.map(cat => <div key={cat._id}
                                className="w-full h-full flex flex-col justify-center items-center spacey-4 my-10">
        <h2 className="relative text-md font-light tracking-wider uppercase text-gray-500
                        after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2
                        after:-translate-x-1/2 after:w-[75%] after:h-[1px] after:bg-gray-300 after:rounded-full
                        md:text-xl
                        lg:text-2xl">
            {cat.name}
        </h2>

        <div className="w-full my-[50px] grid place-items-center gap-y-20 gap-x-3
                        grid-cols-2
                        md:grid-cols-3">
            {
                cat.items.map((itm:ItemType, idx:number) => <ProductCard key={idx} product={itm}/>)
            }
        </div>
        <Link href={`/category/${cat.name}`}
              className="w-full h-[40px] bg-gray-800 text-white text-xs rounded
                        flex justify-center items-center
                        sm:w-[220px]
                        md:text-sm md:w-[250px]
                        lg:text-md lg:w-[280px]">
            SHOW ALL ITEMS
        </Link>
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
