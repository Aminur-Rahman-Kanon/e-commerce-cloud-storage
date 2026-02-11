'use client';

import { useEffect, useState } from 'react';
import { CategoriesType } from '@/app/(admin)/admin/type/categories';
import CategoryItem from '../component/categoryItem/categoryItem';
import Link from 'next/link';

export default function Page () {
    const [categories, setCategories] = useState<CategoriesType[] | []>([])
    
    useEffect(() => {
        fetch('/api/admin/products/category')
        .then(res => res.json())
        .then(data => {
            if (data.categories && data.categories.length){
                setCategories(data.categories)
            }
        })
        .catch(err => console.error(err))
    }, []);

    const headers = categories.length ? Object.keys(categories[0]).filter(hdr => hdr !== 'createdAt' && hdr !== 'updatedAt' && hdr !== '__v')
                    .map(itm => <span key={itm} className='w-[200px] p-2 border border-gray-300 capitalize'>
        {itm}
    </span>) : [];
    headers.push(<span key={'action'} className='w-[200px] p-2 border border-gray-300 capitalize'>Action</span>);

    return (
        <section className='w-full p-6 space-y-6'>
            <div className='w-full flex justify-between items-cetner'>
                <h1 className='capitalize text-2xl font-bold'>Categories</h1>
                <Link href={'/admin/categories/addNewCategory'}
                        className='flex justify-center items-center w-[200px] h-[40px] border border-gray-600 bg-gray-600 text-white' >
                    Add New Category
                </Link>
            </div>
            <div className='w-full mt-15 flex flex-col justify-center items-center space-y-6'>
                <div className='w-full flex justify-center items-center'>
                    {categories.length ? headers : 'No Categories'}
                </div>
                <div className='w-full flex flex-col justify-center items-center space-y-6'>
                    {
                        categories.map((itm, idx) => <CategoryItem key={itm._id} category={itm} index={idx}/>)
                    }
                </div>
            </div>
        </section>
    )
}
