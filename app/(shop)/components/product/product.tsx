'use client';

import { ItemType } from "@/app/(admin)/admin/type/items";
import ProductImagesCarousel from "../ui/productImagesCarousel/productImagesCarousel";
import Image from "next/image";
import { useBasketStore } from '@/app/store/basket/basket';

type Props = {
    product: ItemType;
}

type Basket = {
    item: ItemType,
    quantity: number
}

export default function Product ({ product }: Props) {
    const { addItem } = useBasketStore();

    const itemToAddBasket:Basket = {
        item: product,
        quantity: 1
    }

    if (!product) return;
    
    return (
        <div className="w-full p-3 flex flex-col justify-center items-center gap-10 lg:p-5
                        md: gap-10">
            <div className="w-full max-w-[1200px] mx-auto flex justify-center items-start gap-10
                            flex-col
                            md:flex-col
                            lg:flex-row">
                <div className="w-full lg:w-1/2">
                    <ProductImagesCarousel images={product.image}/>
                </div>

                <div className="w-full flex flex-col justify-center items-start p-0
                                lg:w-1/2">
                    <div className="w-full flex justify-start items-center gap-2">
                        {
                            product.isNewItem ? <span className="w-[50px] h-[25px] p-1 flex justify-center items-center
                                                            bg-yellow-700 text-white text-sm font-normal">
                                New
                            </span> : null
                        }

                        {
                            product.isSale ? <span className="w-[50px] h-[25px] p-1 flex justify-center items-center
                                                            bg-green-500 text-white text-sm font-normal">
                                Sale
                            </span> : null
                        }
                    </div>

                    <div className="w-full flex justify-start items-center my-2">
                        {
                            product.prices ? product?.prices?.discounted! > 0 ? <div className="w-full flex justify-start items-center gap-2">
                                <h3 className="text-sm font-semibold text-gray-600">
                                    &#x24;{product.prices.discounted}
                                </h3>
                                <s className="text-sm font-semibold text-gray-600 text-opacity-50">
                                    &#x24;{product.prices.base}
                                </s>
                            </div>
                            :
                            <h3 className="text-sm font-semibold text-gray-600">
                                &#x24;{product.prices.base}
                            </h3>
                            :
                            null
                        }
                    </div>

                    <h2 className="text-2xl font-normal text-gray-500 tracking-wide uppercase my-2">
                        {product.name}
                    </h2>
                    
                    
                    <div className="w-full flex flex-col justify-center items-start">
                        {
                            product.details?.split('\n').map((dts, idx) => <p key={idx} className="text-sm font-normal my-2">
                                {dts}
                            </p>)
                        }
                    </div>
                    
                    <div className="w-full flex justify-start items-center gap-2 my-2">
                        <button className="w-[200px] h-[40px] text-gray-700 border border-gray-700"
                                onClick={() =>addItem(itemToAddBasket)}>
                            Add To Cart
                        </button>
                        <button className="w-[200px] h-[40px] bg-green-600 text-white text-sm font-semibold">
                            Buy Now
                        </button>
                    </div>

                </div>
            </div>
            <div className="w-full max-w-[1200px] flex flex-col justify-center items-start">
                <h2 className="text-sm font-semibold my-2">
                    Description
                </h2>
                <div className="w-full my-2 flex flex-col justify-center items-start">
                    {product.description?.split('\n').map((dts, idx) => <p key={idx} className="text-sm font-normal my-2">
                        {dts}
                    </p>)}
                </div>
            </div>
        </div>
    )
}
