import Link from "next/link";
import Image from "next/image";
import MobileMenuBtn from "./mobileMenuBtn/mobileMenuBtn";
import HeaderActions from "./headerActions/headerActions";
import { getCategories } from "@/lib/items";

export default async function Header () {

    const categories = await getCategories();

    return (
        <div className="relative w-full p-2 grid grid-cols-[repeat(3,100px)] justify-between items-center 
                        md:grid-cols-[repeat(3,150px)] 
                        lg:grid-cols-[repeat(3,250px)]">
            <MobileMenuBtn />
            <nav className="w-full hidden flex justify-left items-center
                            md:flex">
                <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600 text-center
                                            hover:text-black transition-colors duration-300 ease-out">
                    Home
                </Link>
                <div className="relative w-[80px] mx-3 shrink-0 group">
                    <span className="text-md font-normal text-gray-600">
                        Category
                    </span>
                    <div className="absolute top-full z-50 left-1/2 -translate-x-1/2 w-[200px] p-5 hidden
                                    flex-col justify-start items-start bg-white group-hover:flex
                                    border border-gray-300">
                        {
                            categories.length ? categories.map(cat => <Link key={cat._id} href={`/categories/${cat.name.toLowerCase()}`}
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

            <div className="w-full relative w-full flex justify-center items-center">
                <Image src={'/images/logo/logo_1.png'}
                        alt="antorbon"
                        width={80}
                        height={60}
                        className="w-[75px] h-[55px] object-cover 
                                    lg:w-[80px] lg:h-[60px]" />
            </div>

            <HeaderActions />
        </div>
    )
}
