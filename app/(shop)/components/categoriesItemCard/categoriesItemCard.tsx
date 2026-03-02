'use client';

import { ItemType } from "@/app/(admin)/admin/type/items";
import Image from "next/image";
import Link from "next/link";

type Props = {
    items : ItemType[]
}

export default function CategoriesItemCard ({ items }: Props) {
    if (!items) return;

    return (
        <div className='w-full p-0 justify-center items-center gap-5
                                        grid grid-cols-[repeat(2,1fr)]
                                        md:grid md:grid-cols-[repeat(3,1fr)] md:p-5
                                        xl:w-[calc(100%-350px)]'>
            {
                items.map(itm => <Link  href={`/product/${itm._id}`}
                                        key={itm._id}
                                        className='w-full h-full flex flex-col'>
                    <div className='relative w-full aspect-[3/4] overflow-hidden'>
                        {
                            itm.image[0] ?
                                <Image src={itm.image[0]}
                                        alt={itm.name}
                                        fill 
                                        
                                        priority={false}
                                        className='object-cover' />
                                :
                                <Image src={'/images/icons/placeholder_3.png'}
                                        alt='no image'
                                        fill
                                        className='object-cover' />
                        }
                    </div>
                    <div className="w-full p-3 flex flex-col gap-3 min-h-[110px]">
                        <h4 className='text-sm text-gray-600 font-semibold capitalize'>
                            {itm.name}
                        </h4>
                        {
                            itm.prices?.discounted ? <div className='w-full flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>
                                    &#x24;{itm.prices.discounted}
                                </span>
                                <s className='text-sm text-gray-600 opacity-50'>
                                    &#x24;{itm.prices.base}
                                </s>
                            </div>
                            :
                            <span className='text-sm text-gray-600'>
                                &#x24;{itm.prices?.base}
                            </span>
                        }
                        <p className='text-sm text-gray-600'>
                            {itm.details?.slice(0, 50)}
                        </p>
                    </div>
                </Link>)
            }
        </div>
    )
}