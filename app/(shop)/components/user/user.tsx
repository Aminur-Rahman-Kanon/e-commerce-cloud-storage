'use client';

import React, { useState, useEffect } from 'react';
import { OrdersType } from '@/app/(admin)/admin/type/orders';
import Image from 'next/image';
import { Check } from 'lucide-react';

type PageProps = {
    item: OrdersType
}

function formateDatTime (value:string): string | null {
    if (!value) return null;

    const newDate = new Date(value);
    return `${newDate.toDateString()} ${newDate.toLocaleTimeString()}`;
}

function orderStatus (status:string): React.ReactNode | null {
    if (!status) return null;

    if (status === 'PENDING'){
        return 
    }
}

export default function User ({ item }: PageProps) {
    if (!item) return;

    let displayStatus  = null;

    return (
        <div className='w-full max-w-[1400px] flex flex-col justify-center items-start mx-auto gap-y-5 p-5'>
            <div className='w-full flex flex-col justify-center items-start gap-y-2'>
                <h2 className='text-md font-semibold text-gray-600'>
                    Order details #{item._id}
                </h2>
                <p className='text-sm text-gray-600'>
                    <strong>Date: </strong>
                    {item?.updatedAt ? formateDatTime(item.updatedAt) : 'No information'}
                </p>
            </div>
            <div className='w-full flex flex-col justify-center items-between gap-y-4'>
                <div className='w-full flex items-center'>
                    <div className='w-[30px] h-[30px] bg-blue-500 flex justify-center items-center rounded text-white'>
                        {
                            item.status === 'PENDING' ? <Check size={20} />
                            :
                            '1'
                        }
                    </div>
                    <hr className={`flex-1 h-[3px] ${item.status === 'PROCESSING' || item.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-300'} rounded`} />
                    <div className='w-[30px] h-[30px] bg-blue-500 flex justify-center items-center rounded text-white'>
                        {
                            item.status === 'PROCESSING' ? <Check size={20} />
                            :
                            '2'
                        }
                    </div>
                    <hr className={`flex-1 h-[3px] ${item.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-300'} rounded`} />
                    <div className='w-[30px] h-[30px] bg-blue-500 flex justify-center items-center rounded text-white'>
                        {
                            item.status === 'DELIVERED' ? <Check size={20} />
                            :
                            '3'
                        }
                    </div>
                </div>
                <div className='w-full flex justify-between items-center'>
                    <div className='w-[200px] flex flex-col justify-center items-start gap-y-3'>
                        <h4 className='text-sm font-semibold text-gray-600'>
                            Order Confirmed
                        </h4>
                        <p className='text-gray-600 text-left'>
                            {item.updatedAt ? formateDatTime(item.updatedAt) : 'No Information'}
                        </p>
                    </div>
                    <div className='w-[200px] flex flex-col justify-center items-center gap-y-3'>
                        <h4 className='text-sm font-semibold text-gray-600'>
                            Shipping
                        </h4>
                        <p className='text-gray-600 text-center'>
                            {item.updatedAt ? formateDatTime(item.updatedAt) : 'No Information'}
                        </p>
                    </div>
                    <div className='w-[200px] flex flex-col justify-center items-end gap-y-3'>
                        <h4 className='text-sm font-semibold text-gray-600'>
                            Delivered
                        </h4>
                        <p className='text-gray-600 text-right'>
                            {item.updatedAt ? formateDatTime(item.updatedAt) : 'No Information'}
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col justify-start items-start'>
                {
                    item.items.map(itm => <div key={itm._id} className='w-full flex justify-start items-center'>
                        <div className='relative w-[50px] h-[50px] aspect-square overflow-hidden'>
                            <Image src={itm.image}
                                    alt={itm.name}
                                    fill
                                    sizes='50px'
                                    className='object-cover' />
                        </div>
                        <div className='w-full max-w-[300px] flex flex-col justify-start items-start'>
                            <h3 className='text-sm text-gray-600 capitalize'>
                                {itm.name}
                            </h3>
                            <p className='text-xs text-gray-500'>{itm?.categoryName}</p>

                        </div>
                        <span className='w-[50px] h-[50px] flex justify-center items-center overflow-hidden'>
                            Qty:1
                        </span>
                        <span className='w-[50px] h-[50px] flex justify-center items-center overflow-hidden'>
                            &#x24;{itm.prices}
                        </span>
                    </div>)
                }
            </div>
            //total
            <div>
                <p className='text-sm text-gray-600'>
                    <strong>Subtotal:</strong> &#x24;total
                </p>
                <p className='text-sm text-gray-600'>
                    <strong>Shipping:</strong> &#x24;{item.shipping?.method?.amount}
                </p>
                <hr className='w-full bg-gray-500 my-5'/>
                <h3><strong>Total</strong>&#x24;{(item?.paymentInfo?.totalAmount!/100)}</h3>
            </div>
        </div>
    )
}