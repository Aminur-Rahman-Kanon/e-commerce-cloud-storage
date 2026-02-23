'use client';

import { useBasketStore } from '@/app/store/basket/basket';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrencySymbol } from '../../utilities/utilities';
import { useEffect } from 'react';

type Props = {
    orderInfo: Record<string, any>
}

export default function SuccessPageLayout ({ orderInfo }: Props) {

    const { clearBasket, items } = useBasketStore();
    
    useEffect(() => {
        if (orderInfo && '_id' in orderInfo){
            clearBasket();
        }
    }, [orderInfo])

    if (!orderInfo) return;    

    return (
        <div className="w-full flex flex-col justify-center items-center gap-y-3">
            <div className="w-full flex justify-center items-center">
                <Image src={'/images/icons/check.png'}
                        alt="success"
                        width={80}
                        height={80}
                        className="w-[50px] h-[50px]
                                    lg:w-[80px] lg:h-[80px]" />
                <h1 className="text-2xl text-green-500 font-normal tracking ml-2">
                    Payment Successful !
                </h1>
            </div>
            <h2 className="text-lg font-normal text-gray-600">
                Thank you! Your payment of 
                <span style={{margin: '0 2px 0 5px'}}>
                    { orderInfo.paymentInfo?.currency ? getCurrencySymbol(orderInfo.paymentInfo.currency) : null }
                </span>
                <span style={{ margin: '0 2px' }}>
                    { orderInfo.paymentInfo?.totalAmount ? orderInfo.paymentInfo?.totalAmount / 100 : 0 }
                </span>
                has been received.
            </h2>
            <div className="flex flex-col justify-center items-start gap-y-3">
                <p className="text-sm text-gray-600 font-normal">
                    <strong>Order ID: </strong>
                    { orderInfo._id }
                </p>
                <p className="text-sm text-gray-600 font-normal">
                    <strong>
                        Total amount: 
                    </strong>
                    <span style={{margin: '0 2px 0 3px'}}>
                        { orderInfo.paymentInfo?.currency ? getCurrencySymbol(orderInfo.paymentInfo.currency) : null }
                    </span>
                    <span>
                        { orderInfo.paymentInfo?.totalAmount ? orderInfo.paymentInfo?.totalAmount / 100 : 0 }
                    </span>
                </p>
            </div>
            <h3 className="text-sm text-gray-600 font-semibold my-5 text-center">
                An email has been sent to the email you used for this purchase. Please dont forget to check the spam folder if you cant find our email.
            </h3>
            <Link href={`/user/${orderInfo._id}`}
                className="w-[200px] h-[40px] bg-gray-600 text-white flex justify-center items-center">
                Ok
            </Link>
        </div>
    )
}