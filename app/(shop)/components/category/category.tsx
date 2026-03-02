'use client';

import { useState, useEffect } from 'react';
import { CategoriesType } from '@/app/(admin)/admin/type/categories';
import { ItemType } from '@/app/(admin)/admin/type/items';
import Image from 'next/image';
import Link from 'next/link';
import CategoriesCard from '../categoriesCard/categoriesCard';
import CategoriesItemCard from '../categoriesItemCard/categoriesItemCard';

type Props = {
    category: CategoriesType
}

export default function Category ({ category }: Props) {
    if (!category) return;

    const [items, setItems] = useState<ItemType[] | []>([]);

    const [onSale, setOnSale] = useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isSpecial, setIsSpecial] = useState<boolean>(false);

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
            <h1 className='text-2xl text-gray-600 font-semibold tracking capitalize
                            md:text-4xl'>
                {category.name}
            </h1>

            <div className='w-full flex flex-col justify-center gap-y-5
                            xl:flex-row xl:justify-start'>
                <div className='w-full flex flex-col justify-start items-start gap-y-8
                                xl:w-[300px] xl:p-2'>

                    <CategoriesCard />
                    
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
                        <CategoriesItemCard items={items} />
                        :
                        <span className='block p-2'>
                            No Items
                        </span>
                }
            </div>
        </div>
    )
}