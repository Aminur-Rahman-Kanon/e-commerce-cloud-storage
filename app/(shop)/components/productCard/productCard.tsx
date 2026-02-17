'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProductCard ({ product }: { product: any }) {
    
    if (!product) return;
    
    const addToCartHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    }
    
    return (
        <Link href={`/product/${product._id}`}
              className='w-full h-full group flex flex-col justify-cetner items-center
                        max-w-[330px]
                        sm:max-w-[280px]
                        md:max-w-[280px]
                        lg:max-w-[330px]'>

            <div className='relative w-[calc(100%-50px)] h-[330px] aspect-[3/4] z-20'>
                <Image src={product.image[0]}
                        alt={product.name}
                        fill
                        className='object-cover rounded' />
            </div>

            <div className='relative w-full h-full min-h-[180px] flex flex-col justify-center items-center
                            sm:min-h-[150px]
                            md:min-h-[150px]
                            lg:min-h-[180px]'>

                <div className='absolute bottom-0 left-0 z-10 w-full h-[135%] border border-gray-300 rounded-md pointer-events-none
                                group-hover:border-[#8aa693] transition-colors duration-500 ease-out'>

                </div>

                <div className='w-full flex flex-col justify-center items-center'>
                    <h2 className='text-md font-normal uppercase text-gray-500 my-2 text-center w-[250px] truncate'>
                        {product.name}
                    </h2>
                    <div className='flex justify-center items-center my-2'>
                        {
                            product?.prices?.discounted ?? 0 > 0 ? <div className='flex justify-center items-center'>
                                <h4 className='text-sm font-semibold mx-3'>&#x24;{product?.prices?.discounted}</h4>
                                <s className='text-sm font-normal opacity-25 mx-3'>&#x24;{product?.prices?.base}</s>
                            </div>
                            :
                            <h4 className='text-sm font-semibold'>&#x24;{product?.prices?.discounted}</h4>
                            
                        }
                    </div>
                    <button className='w-full max-w-[200px] h-[40px] bg-gray-700 text-white cursor-pointer hover:bg-gray-800 my-2'
                            onClick={addToCartHandler}>
                        ADD TO CART
                    </button>
                </div>
            </div>
        </Link>
    )
}
