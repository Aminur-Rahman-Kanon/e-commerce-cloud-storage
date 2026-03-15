'use client';

import Image from "next/image";

export default function CategoriesCarousel () {
    return (
        <div className="w-full max-w-[1800px] mx-auto my-20 p-2 grid grid-cols-4 justify-center items-start">
            <div className="w-full flex flex-col justify-center items-center gap-y-5">
                <div className="relative w-full max-w-[50px] aspect-square overflow-hidden
                                md:max-w-[200px]">
                    <Image src={'/images/categories/plants.png'}
                            alt="categories"
                            fill
                            className="object-cover" />
                </div>
                <h4 className="text-xs font-semibold text-gray-600 text-center
                                md:text-sm">
                    Indoor Plants
                </h4>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-y-5">
                <div className="relative w-full max-w-[50px] aspect-square overflow-hidden
                                md:max-w-[200px]">
                    <Image src={'/images/categories/herbal.png'}
                            alt="categories"
                            fill
                            className="object-cover" />
                </div>
                <h4 className="text-xs font-semibold text-gray-600 text-center
                                md:text-sm">
                    Herbal Medicine
                </h4>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-y-5">
                <div className="relative w-full max-w-[50px] aspect-square overflow-hidden
                                md:max-w-[200px]">
                    <Image src={'/images/categories/decoration.png'}
                            alt="categories"
                            fill
                            className="object-cover" />
                </div>
                <h4 className="text-xs font-semibold text-gray-600 text-center
                                md:text-sm">
                    Home Decoration
                </h4>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-y-5">
                <div className="relative w-full max-w-[50px] aspect-square overflow-hidden
                                md:max-w-[200px]">
                    <Image src={'/images/categories/health.png'}
                            alt="categories"
                            fill
                            className="object-cover" />
                </div>
                <h4 className="text-xs font-semibold text-gray-600 text-center
                                md:text-sm">
                    Health & Beauty
                </h4>
            </div>
        </div>
    )
}
