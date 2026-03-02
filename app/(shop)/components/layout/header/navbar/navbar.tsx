'use client';

import Link from "next/link";
import { useMobileMenu } from '@/app/store/mobileMenu/useMobileMenu';

export default function Navabar () {
    const { navbarCategory } = useMobileMenu();

    return (
        <nav className="w-full hidden flex justify-left items-center
                            md:flex">
            <Link href={'/'} className="w-[100px] shrink-0 text-md font-normal text-gray-600 text-center
                                        hover:text-black transition-colors duration-300 ease-out">
                Home
            </Link>
            <div className="relative w-[100px] shrink-0 group">
                <span className="text-md font-normal text-gray-600 cursor-pointer hover:text-black transition-colors duration-300 ease-out">
                    Category
                </span>
                <div className="absolute top-full z-50 left-1/2 -translate-x-1/2 w-[200px] p-5 hidden
                                flex-col justify-start items-start bg-white group-hover:flex
                                border border-gray-300">
                    {
                        navbarCategory?.length ? navbarCategory.map(cat => <Link key={cat?._id} href={`/category/${cat.name.toLowerCase()}`}
                                                                        className="block text-sm text-gray-500 capitalize my-2
                                                                                    hover:transition duration-[400ms] hover:text-gray-800">
                            {cat.name}
                        </Link>)
                        :
                        'No items'
                    }
                </div>
            </div>
            <Link href={'/new-items'} className="w-[100px] shrink-0 text-md font-normal text-gray-600
                                        hover:text-black transition-colors duration-300 ease-ou">
                What's New
            </Link>
        </nav>
    )
}
