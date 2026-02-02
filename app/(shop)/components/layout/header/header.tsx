'use client'

import Link from "next/link";
import { Search, ShoppingBasket } from 'lucide-react';
import Image from "next/image";
import { useBasket } from "@/app/(shop)/context/basketProvider/basketProvider";

export default function Header () {
    const { count } = useBasket();

    return (
        <div className="w-full p-2 grid grid-cols-[repeat(3,250px)] justify-between items-center">
            <nav className="w-full flex justify-left items-center">
                <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600 text-center
                                            hover:text-black transition-colors duration-300 ease-out">
                    Home
                </Link>
                <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600
                                            hover:text-black transition-colors duration-300 ease-out">
                    Category
                </Link>
                <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600
                                            hover:text-black transition-colors duration-300 ease-ou">
                    About Us
                </Link>
            </nav>

            <div className="relative w-full flex justify-center items-center">
                <Image src={'/images/logo/logo_1.png'}
                        alt="antorbon"
                        width={125}
                        height={125}
                        style={{ objectFit: 'cover' }} />
            </div>

            <div className="relative w-full flex justify-end items-center px-2">
                <Link href={'/basket'} className="w-[35px] h-[35px] flex justify-center items-center">
                    <Search size={20} color="gray" />
                </Link>
                <Link href={'/basket'} className="relative block w-[35px] h-[35px] flex justify-center items-center">
                    <ShoppingBasket size={20} color="gray" />
                    <span className="absolute -top-3 -right-2 w-[25px] h-[25px] rounded-full z-10
                                    bg-[#012523] text-white text-xs -font-normal
                                    flex justify-center items-center">
                        {count}
                    </span>
                </Link>
            </div>
        </div>
    )
}
