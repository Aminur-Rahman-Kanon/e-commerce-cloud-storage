'use client';

import { OrdersType } from '@/app/(admin)/admin/type/orders';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { formateDatTime } from '@/app/(shop)/utilities/utilities';

type PageProps = {
    item: OrdersType
}

export default function User ({ item }: PageProps) {
    if (!item) return;

    const orderShippingStyle = item.status === 'SHIPPING' || item.status === 'DELIVERED' ?
        'bg-blue-500' : 'bg-gray-300';
    
    function calculateSubTotal (): number {
        if (!item) return 0;

        const total = item.paymentInfo?.totalAmount ? item.paymentInfo?.totalAmount /100 : 0;
        const shipping = item.shipping?.method?.amount ? item.shipping?.method?.amount / 100 : 0;

        if (!total || !shipping) return 0;
        
        return total - shipping;

    }

    return (
        <div className='w-full max-w-[1400px] min-h-screen flex flex-col justify-start items-start mx-auto gap-y-10 my-10 p-2
                        lg:p-5'>
            <div className='w-full flex flex-col justify-center items-start gap-y-2'>
                <h2 className='text-md font-semibold text-gray-600'>
                    Order details #{item._id}
                </h2>
                <p className='text-sm text-gray-600'>
                    <strong>Date: </strong>
                    {item?.updatedAt ? formateDatTime(item.updatedAt) : 'No information'}
                </p>
            </div>
            <div className='w-full flex flex-col justify-center items-between'>
                {
                    item.status === 'CANCELED' ? <div className='w-full flex flex-col justify-center items-start'>
                        <X size={30} color='red'/>
                        <h4 className='text-sm font-semibold text-gray-600'>
                            Order Canceled!
                        </h4>
                        <p className='text-xs text-gray-600 text-left'>
                            {item.updatedAt ? formateDatTime(item.updatedAt) : 'No Information'}
                        </p>
                    </div>
                    :
                    <div className='w-full flex flex-col justify-center items-between gap-y-4'>
                        <div className='w-full flex items-center'>
                            <div className='w-[30px] h-[30px] bg-blue-500 flex justify-center items-center rounded text-white'>
                                {
                                    item?.status ? <Check size={20} />
                                    :
                                    '1'
                                }
                            </div>
                            <hr className={`flex-1 h-[3px] ${item.status === 'SHIPPING' || item.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-300'} rounded`} />
                            <div className={`w-[30px] h-[30px] ${orderShippingStyle} flex justify-center items-center rounded text-white`}>
                                {
                                    item.status === 'SHIPPING' || item.status === 'DELIVERED' ? <Check size={20} />
                                    :
                                    '2'
                                }
                            </div>
                            <hr className={`flex-1 h-[3px] ${item.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-300'} rounded`} />
                            <div className={`w-[30px] h-[30px] flex justify-center items-center ${item.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-300'} rounded text-white`}>
                                {
                                    item.status === 'DELIVERED' ? <Check size={20} />
                                    :
                                    '3'
                                }
                            </div>
                        </div>
                        <div className='w-full flex justify-between items-start'>
                            <div className='w-[200px] flex flex-col justify-center items-start gap-y-3'>
                                <h4 className='text-sm font-semibold text-gray-600'>
                                    Order Confirmed
                                </h4>
                                <p className='text-xs text-gray-600 text-left'>
                                    {item.updatedAt ? formateDatTime(item.updatedAt) : 'No Information'}
                                </p>
                            </div>
                            <div className='w-[200px] flex flex-col justify-center items-center gap-y-3'>
                                <h4 className='text-sm font-semibold text-gray-600'>
                                    Shipping
                                </h4>
                                <p className='text-xs text-gray-600 text-center'>
                                    {item.shipping?.estimatedShipping  ? formateDatTime(item.shipping.estimatedShipping) : null}
                                </p>
                            </div>
                            <div className='w-[200px] flex flex-col justify-center items-end gap-y-3'>
                                <h4 className='text-sm font-semibold text-gray-600'>
                                    Delivered
                                </h4>
                                <p className='text-xs text-gray-600 text-right'>
                                    {item.delivery.deliveredDate ? formateDatTime(item.delivery.deliveredDate) : null}
                                </p>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className='w-full flex flex-col justify-start items-start'>
                {
                    item.items.map(itm => <div key={itm._id} className='w-full flex justify-between items-center'>
                        <div className='flex justify-start items-center gap-x-3'>
                            <div className='relative w-[50px] h-[50px] aspect-square overflow-hidden'>
                                <Image src={itm.image}
                                        alt={itm.name}
                                        fill
                                        sizes='50px'
                                        className='object-cover' />
                            </div>
                            <div className='flex flex-col justify-start items-start'>
                                <h3 className='text-sm text-gray-600 capitalize'>
                                    Title: {itm.name}
                                </h3>
                                <p className='text-xs text-gray-500'>Category: {itm?.categoryName}</p>
                            </div>
                        </div>
                        <span className='w-[50px] h-[50px] text-sm text-gray-600 flex justify-center items-center overflow-hidden'>
                            Qty: {itm.quantity}
                        </span>
                        <span className='w-[50px] h-[50px] text-sm text-gray-600 flex justify-center items-center overflow-hidden'>
                            &#x24;{itm.prices}
                        </span>
                    </div>)
                }
            </div>
            <div className='full flex flex-col justify-center items-start'>
                <p className='text-sm text-gray-600'>
                    <strong>Subtotal:</strong> &#x24;{calculateSubTotal()?.toFixed(2)}
                </p>
                <p className='text-sm text-gray-600'>
                    <strong>Shipping:</strong> &#x24;{item.shipping?.method?.amount ? item.shipping?.method?.amount / 100 : 'No information'}
                </p>
                <hr className='w-full bg-gray-500 my-5'/>
                <h3 className='text-md font-normal text-gray-600'>
                    <strong>Total:</strong> &#x24;{(item?.paymentInfo?.totalAmount!/100)}
                </h3>
            </div>

            <div className='w-full flex flex-col justify-start items-start gap-y-2'>
                <h2 className='text-md font-semibold text-gray-600'>Need Help ?</h2>
                <p className='text-sm text-gray-600 font-normal'>
                    Our team are up for your service 24/7
                </p>
                <div className='w-full flex flex-col justify-start items-start'>
                    <a href='tel:00447878107873'
                        className='text-gray-600 text-sm'>
                        +447878107873
                    </a>
                    <a href='mailto:antorbon.app@gmail.com'
                        className='text-gray-600 text-sm'>
                        antorbon.app@gmail.com
                    </a>
                    <a href='www.antorbon.com'
                        className='text-sm text-gray-600'>
                        www.antorbon.com
                    </a>
                </div>
            </div>
        </div>
    )
}