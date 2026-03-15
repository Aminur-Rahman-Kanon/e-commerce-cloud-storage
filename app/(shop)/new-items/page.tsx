import { getNewItems } from "@/lib/items";
import Link from "next/link";
import CategoriesCard from "../components/categoriesCard/categoriesCard";
import Image from "next/image";
import { CategoriesType } from '@/app/(admin)/admin/type/categories';

export default async function Page () {
    const category:CategoriesType[] = await getNewItems();
    
    if (!category) return;

    return (
        <div className="w-full max-w-[1800px] min-h-screen mx-auto my-10 p-2 flex flex-col justify-start items-start gap-y-[50px]
                        md:p-5">
            <h1 className="text-2xl text-gray-600 font-semibold
                            md:text-4xl">
                What's New
            </h1>
            <div className="w-full h-full grid grid-cols-[1fr]
                            xl:grid-cols-[300px_1fr]">
                <div className="w-full h-full hidden
                                xl:block">
                    <CategoriesCard />
                </div>
                <div className="w-full flex flex-col space-y-5">
                    {
                        category.map(cat => <div key={cat._id} className="w-full flex flex-col justify-start items-start gap-y-5">
                            <h2 className="text-2xl text-gray-600 capitalize">
                                {cat.name}
                            </h2>
                            <div className="w-full grid grid-cols-2 justify-start items-start gap-2
                                            md:grid-cols-3 md:gap-5">
                                {
                                    cat.items?.map(itm => <Link key={itm._id}
                                                                href={`/product/${itm._id}`}
                                                                className="w-full flex flex-col justify-start items-start gap-y-3">
                                        <div className="relative w-full aspect-[3/4] overflow-hidden">
                                            <Image src={itm.image[0]}
                                                    alt={itm.name}
                                                    fill
                                                    className="object-cover" />
                                        </div>
                                        <div className="w-full flex flex-col justify-start items-start gap-y-2 p-2">
                                            <h4 className="text-sm font-semibold capitalize text-gray-600">
                                                { itm.name }
                                            </h4>
                                            <div className="w-full flex justify-between items-center">
                                                <p className="text-xs font-normal text-gray-600">
                                                    &#x24;{ itm.prices?.discounted ? itm.prices.discounted : itm.prices?.base }
                                                </p>
                                                <s className="text-xs font-normal text-gray-400"
                                                    style={itm.prices?.discounted ? { display:'block' } : { display: 'none' }}>
                                                    &#x24;{itm.prices?.base}
                                                </s>
                                            </div>
                                            <p className="text-xs text-gray-600 ">
                                                {itm.description?.slice(0, 50)}
                                            </p>
                                        </div>
                                    </Link>)
                                }
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}