import Link from "next/link";
import Image from "next/image";
import MobileMenuBtn from "./mobileMenuBtn/mobileMenuBtn";
import HeaderActions from "./headerActions/headerActions";
import { getCategories } from "@/lib/items";
import Navbar from "./navbar/navbar";
import MobileMenu from "./mobileMenu/mobileMenu";

export default async function Header () {

    const categories = await getCategories();

    return (
        <div className="relative w-full p-2 grid grid-cols-[repeat(3,100px)] justify-between items-center 
                        md:grid-cols-[repeat(3,150px)] 
                        lg:grid-cols-[repeat(3,250px)]">
            <MobileMenuBtn />

            <MobileMenu categories={categories} />
            
            <Navbar categories={categories} />

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
