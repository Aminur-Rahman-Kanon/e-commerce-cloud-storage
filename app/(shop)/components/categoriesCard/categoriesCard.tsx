'use client';

import { useMobileMenu } from '@/app/store/mobileMenu/useMobileMenu';
import Link from 'next/link';

export default function CategoriesCard () {
    const { navbarCategory } = useMobileMenu();

    return (
        <div className='w-full hidden space-y-8 
                        xl:block'>
            <h2 className='text-md text-gray-600 font-normal'>
                Category
            </h2>
            {
                navbarCategory?.length ?
                    <ul className='space-y-2'>
                        {
                            navbarCategory?.map(cat => <li key={cat._id} className='text-sm text-gray-600 capitalize'>
                                <Link href={`/category/${cat.name.toLowerCase()}`}>
                                    {cat.name}
                                </Link>
                            </li>)
                        }
                    </ul>
                    :
                    'No Items'
            }
        </div>
    )
}