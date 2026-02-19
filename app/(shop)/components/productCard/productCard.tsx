'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useBasketStore, BasketItem } from '@/app/store/basket/basket';
import { ItemType } from '@/app/(admin)/admin/type/items';

export default function ProductCard ({ product }: { product: ItemType }) {

    const { addItem } = useBasketStore();
    
    if (!product) return;
    
    const addToCartHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const itemToAdd: BasketItem = {
            item: product,
            quantity: 1
        }

        addItem(itemToAdd);
    }
    
    return (
        <Link href={`/product/${product._id}`}
              className='w-full h-full group flex flex-col justify-cetner items-center
                        max-w-[330px]
                        sm:max-w-[280px]
                        md:max-w-[280px]
                        lg:max-w-[330px]'>

            <div className='relative w-[calc(100%-20px)] h-[200px] aspect-[3/4] z-20
                            md:h-[235px]
                            lg:h-[280px]'>
                <Image src={product.image[0]}
                        alt={product.name}
                        fill
                        className='object-cover rounded' />
            </div>

            <div className='relative w-full h-full flex flex-col justify-center items-center'>

                <div className='absolute bottom-0 left-0 z-10 w-full h-[calc(100%+35px)] border border-gray-300 rounded pointer-events-none
                                group-hover:border-[#8aa693] transition-colors duration-500 ease-out'>

                </div>

                <div className='w-full flex flex-col justify-end items-center overflow-hidden'>
                    <h2 className='text-xs font-normal uppercase text-gray-500 my-2 text-center w-[250px] truncate
                                    md:sm'>
                        {product.name}
                    </h2>
                    <div className='flex justify-center items-center my-2'>
                        {
                            product?.prices?.discounted ?? 0 > 0 ? <div className='flex justify-center items-center'>
                                <h4 className='text-xs text-gray-600 font-semibold mx-3
                                                md:sm'>
                                    &#x24;{product?.prices?.discounted}
                                </h4>
                                <s className='text-sm text-gray-600 font-normal opacity-25 mx-3'>&#x24;{product?.prices?.base}</s>
                            </div>
                            :
                            <h4 className='text-sm text-gray-600 font-semibold'>&#x24;{product?.prices?.base}</h4>
                            
                        }
                    </div>
                    <button className='w-full h-[40px] bg-gray-700 text-white 
                                        cursor-pointer hover:bg-gray-800 mt-2 
                                        text-xs
                                        md:text-sm'
                            onClick={addToCartHandler}>
                        ADD TO CART
                    </button>
                </div>
            </div>
        </Link>
    )
}
