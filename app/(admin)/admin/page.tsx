'use client';

import { useAdminAuth } from "./hooks/useAdminAuth";
import Header from "./component/layout/header/header";
import { useEffect, useState } from "react";
import Link from 'next/link';



export default function Page() {
    
    const [catLength, setCatLength] = useState<number>(0);
    const [itemLength, setItemLength] = useState<number>(0);
    
    useAdminAuth();
    
    async function getCategoriesLength() {
        try {
            const category = await fetch('/api/admin/products/category').then(res => res.json()).catch(err => new Error(err));
            if (category.categories && category.categories.length){
                setCatLength(category.categories.length)
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    async function getItemsLength() {
        try {
            const items = await fetch('/api/admin/products/items').then(res => res.json()).catch(err => new Error(err));
            if(items?.items?.length){
                setItemLength(items.items.length)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCategoriesLength();
        getItemsLength();
    }, [])

    return (
        <div className="w-full space-y-6 px-6">
            <Header />

            {/* Page Title */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="w-[150px] h-[40px] flex justify-center items-center bg-green-700 text-white">Status: Healthy</div>
            </div>

            <section className="w-full flex justify-left items-center space-x-6">
                <Link href={'/admin/categories'}
                      className="w-[300px] p-6 rounded flex flex-col justify-center items-center
                                border border-gray-300"  >
                    <h2 className="text-gray-700 font-bold"> Categories: {catLength}</h2>
                    <p className="text-gray-700 font-normal">Tap to manage Categories</p>
                </Link>
                <Link href={'/admin/items'}
                      className="w-[300px] p-6 rounded flex flex-col justify-center items-center
                                border border-gray-300"  >
                    <h2 className="text-gray-700 font-bold"> Items: {itemLength}</h2>
                    <p className="text-gray-700 font-normal">Tap to manage Items</p>
                </Link>
                <Link href={'/admin/orders'}
                      className="w-[300px] p-6 rounded flex flex-col justify-center items-center
                                border border-gray-300"  >
                    <h2 className="text-gray-700 font-bold"> Orders: 10</h2>
                    <p className="text-gray-700 font-normal">Tap to manage Orders</p>
                </Link>
            </section>
        </div>
    );
}