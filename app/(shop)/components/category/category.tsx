'use client';

import { useState, useEffect } from 'react';
import { CategoriesType } from '@/app/(admin)/admin/type/categories';
import { ItemType } from '@/app/(admin)/admin/type/items';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    category: CategoriesType
}

export default function Category ({ category }: Props) {
    if (!category) return;

    const [items, setItems] = useState<ItemType[] | []>([]);

    const [onSale, setOnSale] = useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isSpecial, setIsSpecial] = useState<boolean>(false);

    // useEffect(() => {
    //     if (category.items?.length){
    //         setItems(category?.items);
    //     }
    // }, []);

    useEffect(() => {
        let cat:ItemType[] = category.items!;

        if (onSale){
            cat = cat?.filter(itm => itm.isSale === onSale)
        }

        if (isSpecial) {
            cat = cat?.filter(itm => itm.isSpecial === isSpecial)
        }

        if (isNew) {
            cat = cat?.filter(itm => itm.isNewItem === isNew);
        }

        setItems(cat);
        
    }, [onSale, isNew, isSpecial]);

    return (
        <div className='w-full max-w-[1800px] mx-auto my-[50px] flex flex-col justify-center items-start gap-y-10 p-3 overflow-hidden'>
            <h1 className='text-2xl text-gray-600 font-semibold tracking capitalize'>
                {category.name}
            </h1>

            <div className='w-full flex flex-col justify-center
                            xl:flex-row xl:justify-start'>
                <div className='w-full p-2 flex flex-col justify-start items-start gap-y-8
                                xl:w-[300px]'>
                    <div className='w-full hidden space-y-8
                                    xl:block'>
                        <h2 className='text-md text-gray-600 font-normal'>
                            Category
                        </h2>
                        <ul className='space-y-2'>
                            <li className='text-sm text-gray-600'>
                                <Link href={'/category/indoor plants'}>
                                    Indoor Plants
                                </Link>
                            </li>
                            <li className='text-sm text-gray-600'>
                                <Link href={'/category/herbal medicine'}>
                                    Herbal Medicine
                                </Link>
                            </li>
                            <li className='text-sm text-gray-600'>
                                <Link href={'/category/home decoration'}>
                                    Home Decoration
                                </Link>
                            </li>
                            <li className='text-sm text-gray-600'>
                                <Link href={'/category/health & beauty'}>
                                    Health & Beauty
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='w-full flex flex-col justify-start items-start gap-y-5
                                    sm:flex-row
                                    xl:flex-col'>
                        <div className='w-full flex flex-row justify-start items-center gap-x-2
                                        xl:flex-col xl:items-start'>
                            <h3 className='text-sm text-gray-600 m-0'>
                                Price
                            </h3>
                            <select className='border border-gray-500 bg-white text-sm text-gray-600
                                                xl:mt-3 px-1'>
                                <option disabled>Please select</option>
                                <option value={'high'}>From low to high</option>
                                <option value={'low'}>From high to low</option>
                            </select>
                        </div>
                        <div className='w-full flex flex-row justify-start items-start gap-x-2
                                        xl:flex-col xl:gap-y-2'>
                            <label className='block flex justify-start items-cetner gap-2 text-sm text-gray-600'>
                                <input type="checkbox" onChange={(e) => setOnSale(e.target.checked)}/>
                                On Sale
                            </label>
                            <label className='block flex justify-start items-cetner gap-2 text-sm text-gray-600'>
                                <input type="checkbox" onChange={(e) => setIsNew(e.target.checked)}/>
                                New Item
                            </label>
                            <label className='block flex justify-start items-cetner gap-2 text-sm text-gray-600'>
                                <input type="checkbox" onChange={(e) => setIsSpecial(e.target.checked)}/>
                                Special Item
                            </label>
                        </div>
                    </div>
                </div>
                {
                    items.length ? 
                        <div className='w-full p-5 justify-center items-center gap-5
                                        grid grid-cols-[repeat(2,1fr)]
                                        md:grid md:grid-cols-[repeat(3,1fr)]
                                        xl:w-[calc(100%-350px)]'>
                            {
                                items.map(itm => <Link  href={`/product/${itm._id}`}
                                                        key={itm._id}
                                                        className='w-full h-full flex flex-col'>
                                    <div className='relative w-full aspect-[3/4] overflow-hidden'>
                                        <Image src={itm.image[0]}
                                                alt={itm.name}
                                                fill 
                                                
                                                priority={false}
                                                className='object-cover' />
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
                        :
                        <span className='block p-2'>
                            No Items
                        </span>
                }
            </div>
        </div>
    )
}