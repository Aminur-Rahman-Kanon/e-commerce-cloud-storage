'use client';

import Link from "next/link";
import { CategoriesType } from "@/app/(admin)/admin/type/categories";

type Props = {
    categories: CategoriesType[]
}

export default function Navabar ({ categories }: Props) {
    return (
        <nav className="w-full hidden flex justify-left items-center
                            md:flex">
            <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600 text-center
                                        hover:text-black transition-colors duration-300 ease-out">
                Home
            </Link>
            <div className="relative w-[80px] mx-3 shrink-0 group">
                <span className="text-md font-normal text-gray-600 cursor-pointer">
                    Category
                </span>
                <div className="absolute top-full z-50 left-1/2 -translate-x-1/2 w-[200px] p-5 hidden
                                flex-col justify-start items-start bg-white group-hover:flex
                                border border-gray-300">
                    {
                        categories?.length ? categories.map(cat => <Link key={cat?._id} href={`/categories/${cat.name.toLowerCase()}`}
                                                                        className="block text-sm text-gray-500 capitalize my-2
                                                                                    hover:transition duration-[400ms] hover:text-gray-800">
                            {cat.name}
                        </Link>)
                        :
                        'No items'
                    }
                </div>
            </div>
            <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600
                                        hover:text-black transition-colors duration-300 ease-ou">
                About Us
            </Link>
        </nav>
    )
}
