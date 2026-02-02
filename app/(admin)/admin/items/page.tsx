'use client';

import { useState, useEffect } from 'react';
import { ItemType } from '@/app/(admin)/admin/type/items';
import Item from '../component/item/item';
import Link from 'next/link';

export default function Page () {
    const [items, setItems] = useState<ItemType[] | []>([])

    useEffect(() => {
        fetch('/api/admin/products/items')
        .then(res => res.json())
        .then(item => setItems(item.items))
        .catch(err => console.error(err));
    }, []);

    return (
        <div className='w-full flex flex-col justify-center p-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-bold capitalize'>Items</h1>
                <Link href={'/admin/items/add-new-item'}
                        className='w-[200px] h-[40px] bg-gray-300 text-black text-sm font-bold flex justify-center items-center'>
                    Add new Item
                </Link>
            </div>
            <div>
                {
                    items.length ? items.map((itms, idx) => <Item key={itms.id} index={idx} item={itms}/> ) : 'No item'
                }
            </div>
        </div>
    )
}
