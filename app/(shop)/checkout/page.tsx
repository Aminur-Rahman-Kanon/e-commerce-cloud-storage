'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { BasketItem, useBasket } from '@/app/(shop)/context/basketProvider/basketProvider';
import { createCheckout } from '@/app/actions/checkout';

type UserInfo = {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string
}

export type CheckoutObj = {
    items: BasketItem[],
    shipping: number
}

export default function Page() {

    const { items } = useBasket();

    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    })

    const [ shipping, setShipping ] = useState<number>(70);

    function onChangeHandler(e:React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const { name, value } = e.target;

        setUserInfo(prev => prev ? {
            ...prev,
            [name]: value
        }: prev)
    }

    function shippingInputHandler (e:React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();

        const value = e.target.value;
        if (typeof value !== 'number') return;

        setShipping(value);
    }

    const subTotal = items.reduce((acc, itm) => {
        const price = itm.item.prices?.discounted ?? 0 > 0 ? 
            itm.item.prices?.discounted : itm.item.prices?.base;
        
            return acc + price! * itm.quantity
    }, 0)

    const total = subTotal + shipping;

    const checkoutObj:CheckoutObj = {
        items,
        shipping
    }

    return (
        <div className='w-full max-w-[1400px] mx-auto my-10 flex flex-col justify-center items-center'>
            <h1 className='text-xl font-bold tracking-wider'>Checkout</h1>

            <div className='w-full flex justify-center items-start gap-x-3'>
                <div className='w-[calc(100%-450px)] flex flex-col justify-start'>
                    <div className='w-full flex flex-col justify-start'>
                        <h2 className='text-lg font-normal tracking-wide'>About You</h2>
                        <form className='w-full flex flex-col items-start'>
                            <div className='w-full flex items-start'>
                                <label htmlFor='firstName'>
                                    First Name
                                </label>
                                <input type='text'
                                        id='firstName'
                                        name='firstName'
                                        className='w-full h-[40px] pl-2 border border-gray-300 text-gray-400'
                                        onChange={onChangeHandler} />
                            </div>
                            <div className='w-full flex items-start'>
                                <label htmlFor='lastName'>
                                    Last Name
                                </label>
                                <input type='text'
                                        id='lastName'
                                        name='lastName'
                                        className='w-full h-[40px] pl-2 border border-gray-300 text-gray-400'
                                        onChange={onChangeHandler} />
                            </div>
                            <div className='w-full flex items-start'>
                                <label htmlFor='email'>
                                    Email
                                </label>
                                <input type='email'
                                        id='email'
                                        name='email'
                                        className='w-full h-[40px] pl-2 border border-gray-300 text-gray-400'
                                        onChange={onChangeHandler} />
                            </div>
                            <div className='w-full flex items-start'>
                                <label htmlFor='phone'>
                                    Phone Number
                                </label>
                                <input type='text'
                                        id='phone'
                                        name='phone'
                                        className='w-full h-[40px] pl-2 border border-gray-300 text-gray-400'
                                        onChange={onChangeHandler} />
                            </div>
                            <div className='w-full flex items-start'>
                                <label htmlFor='address'>
                                    Full Address
                                </label>
                                <input type='text'
                                        id='address'
                                        name='address'
                                        className='w-full h-[40px] pl-2 border border-gray-300 text-gray-400'
                                        onChange={onChangeHandler} />
                            </div>
                            <p className='text-xs text-gray-700'>
                                By Clicking "Place Order". You confirm that you have read and agreed to our
                                <Link href={'#'} className='text-xs text-blue-500'>
                                    Privacy Policy
                                </Link>
                                and 
                                <Link href={'#'} className='text-xs text-blue-500'>
                                    Terms of Sale
                                </Link>
                            </p>
                            <button className='w-[200px] h-[40px] flex justify-cetner items-center bg-blue-500 text-white gap-x-2'
                                    type='submit'>
                                <Shield size={10} />
                                Place Order
                            </button>
                        </form>
                    </div>

                    <div className='w-full flex flex-col justify-start'>
                        <h2 className='text-medium font-normal tracking-wide'>Payment Method</h2>
                        {/*Payment method*/}
                    </div>
                </div>

                <div className='w-[450px] flex flex-col items-start'>
                    <h2 className='text-medium font-normal tracking-wide'>Order Summary</h2>
                    <div className='w-full flex flex-col items-start'>
                        <div className='w-full flex justify-between items-center'>
                            <label className='w-[80px] text-sm font-normal text-gray-300'>Subtotal</label>
                            <label className='w-[80px] text-sm font-normal text-gray-300'>&#2547;2549</label>
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <label className='w-[80px] text-sm font-normal text-gray-300'>Shipping</label>
                            <select className='w-full h-[30px]'
                                    defaultValue={70}
                                    onChange={shippingInputHandler}>
                                <option disabled>Please Select</option>
                                <option>&#x24;70</option>
                                <option>&#x24;150</option>
                            </select>
                        </div>
                        <div className='w-full flex justify-between items-center mt-10'>
                            <label className='w-[80px] text-sm font-normal text-gray-300'>Total</label>
                            <label className='w-[80px] text-sm font-normal text-gray-300'>&#2547;2649</label>
                        </div>
                    </div>
                    <div className='w-full flex flex-col items-start'>
                        <h3 className='text-sm text-gray-500'>Arrives by Thu, Jun 26</h3>
                        <div className='w-full flex flex-col items-start'>
                            {
                                items?.map(itm => <div key={itm.item._id} className='w-full flex items-start'>
                                    <div className='relative w-[50px] h-[50px] aspect-square overflow-hidden'>
                                        <Image src={itm.item.image?.[0]}
                                                alt='cart item'
                                                fill
                                                className='object-cover' />
                                    </div>
                                    <div className='w-[calc(100%-50px)] flex flex-col items-start p-2'>
                                        <h4 className='text-sm font-bold text-gray-500 capitalize'>
                                            {itm.item.name}
                                        </h4>
                                        <p className='text-xs text-gray-300'>
                                            Style: #CW87878-901
                                        </p>
                                        <p className='text-xs text-gray-300'>
                                            Size: 9
                                        </p>
                                        <p className='text-xs text-gray-300'>
                                            Color: Blue
                                        </p>
                                        <p className='text-xs text-gray-300'>
                                            Qty: 1 * {itm.item.prices?.discounted ?? itm.item.prices?.base}
                                        </p>
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}