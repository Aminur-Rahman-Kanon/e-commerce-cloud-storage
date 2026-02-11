'use client';

import Image from "next/image";
import { OrdersType } from "../../type/orders";
import { countryCodeToName } from "../../utilities/utilities";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Modal from "@/app/(shop)/components/layout/modal/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type Props = {
    product: OrdersType
}

type Status = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELED'

export default function OrderCard({ product }: Props) {
    const [item, setItem] = useState<OrdersType | null>(null);
    const [displayWarningMsg, setDisplayWarningMsg] = useState<boolean>(false);
    
    const [removeBtnDisable, setRemoveBtnDisable] = useState(false);
    const [warningMsgBtnSpinner, setWarningMsgBtnSpinner] = useState(false);
    const [warningMsgBtnDisable, setWarningMsgBtnDisable] = useState(false);

    useEffect(() => {
        if (product){
            setItem(product);
        }
    }, [product])

    async function updateOrderStatus(status:Status){
        const res = await fetch('/api/admin/orders', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status, id: item?._id })
        })

        if (!res.ok) return toast.error('Order update failed!');

        const updatedStatus = await res.json();
        
        if (updatedStatus?.acknowledged && updatedStatus?.matchedCount > 0){
            setItem(prev => prev ? {
                ...prev,
                status
            }: prev)

            return toast.success(`Order Updated!`)
        }
    }

    async function removeOrderHandler() {
        setWarningMsgBtnSpinner(true);
        setWarningMsgBtnDisable(true);
        setRemoveBtnDisable(true);

        const res = await fetch('/api/admin/orders', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: item?._id })
        })

        setWarningMsgBtnSpinner(false);
        setWarningMsgBtnDisable(false);
        setRemoveBtnDisable(false);
        if (!res.ok) {
            return toast.error('Order deletion failed!');
        }

        toast.success('Order deleted!');

        return setTimeout(() => {
            window.location.reload();
        }, 1700)
    }

    if (!item) return;

    let statusTextClass = 'text-gray-500'
    if (item.status === 'PROCESSING'){
        statusTextClass = 'text-blue-700'
    }
    else if (item.status === 'DELIVERED'){
        statusTextClass = 'text-green-600'
    }
    else if (item.status === 'CANCELED'){
        statusTextClass = 'text-red-500'
    }

    const warningMsg = <div className="w-full flex flex-col justify-center items-center p-2">
        <h2 className="text-sm text-gray-600">Are you sure to remove this order?</h2>
        <div className="w-full flex justify-center items-center gap-2 mt-5">
            <button className="w-[150px] h-[40px] bg-green-600 text-white"
                    disabled={warningMsgBtnDisable}
                    onClick={removeOrderHandler}>
                {
                    warningMsgBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse />
                                        :
                                        'Yes'
                }
            </button>
            <button className="w-[150px] h-[40px] bg-red-600 text-white"
                    onClick={() => setDisplayWarningMsg(false)}>
                No
            </button>
        </div>
    </div>

    return (
        <>
        <Modal isOpen={displayWarningMsg}>
            {warningMsg}
        </Modal>
        <div className="w-full flex flex-col justify-start items-start gap-y-5">
            <p className="text-sm text-gray-600 capitalize"><strong>Order Id:</strong> {item._id}</p>
            <p className="text-sm text-gray-600 capitalize"><strong>Order Placed:</strong> {new Date(item.updatedAt).toString()}</p>
            <h3 className="text-gray-600 font-semibold">Status: <strong className={statusTextClass}>{item.status}</strong></h3>
            <div className="w-full flex flex-wrap justify-start items-start gap-10">
                <div className="w-full max-w-[350px] flex flex-col justify-start items-start">
                    <h2 className="text-lg text-gray-700">Shipping Info:</h2>
                    <div className="w-full flex justify-start items-start gap-5 my-5">
                        <div className="flex flex-col justify-start items-start gap-y-2">
                            <p className="text-sm text-gray-600 capitalize"><strong>Line 1:</strong> {item.shipping?.address?.line1 ?? ''}</p>
                            {
                                item.shipping?.address.line2 ? 
                                <p className="text-sm text-gray-600 capitalize"><strong>Line 2:</strong> {item.shipping?.address?.line2 ?? ''}</p>
                                :
                                null
                            }
                            <p className="text-sm text-gray-600 capitalize"><strong>Postal Code:</strong> {item.shipping?.address?.postal_code ?? ''}</p>
                            {
                                item.shipping?.address.state ?
                                <p className="text-sm text-gray-600 capitalize"><strong>State:</strong> {item.shipping?.address?.state ?? ''}</p>
                                :
                                null
                            }
                            <p className="text-sm text-gray-600 capitalize"><strong>City:</strong> {item.shipping?.address?.city ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Country:</strong> {item.shipping?.address?.country ? countryCodeToName(item.shipping?.address.country) : ''}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-y-2">
                            <p className="text-sm text-gray-600 capitalize"><strong>Delivery:</strong> {item.shipping?.method?.label  ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Customer Name:</strong> {item.shipping?.customerName ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Amount:</strong> {item.shipping?.method?.amount ?? ''}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-[350px] flex flex-col justify-start items-start">
                    <h2 className="text-lg text-gray-700">Payment Info:</h2>
                    <div className="w-full flex justify-start items-start gap-5 my-5">
                        <div className="flex flex-col justify-start items-start gap-y-2">
                            <p className="text-sm text-gray-600 capitalize"><strong>Brand:</strong> {item.paymentInfo?.cardInfo?.brand ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Last 4 Digits:</strong> {item.paymentInfo?.cardInfo?.last4 ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Expiry Month:</strong> {item.paymentInfo?.cardInfo?.expMonth ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Expiry Year:</strong> {item.paymentInfo?.cardInfo?.expYear ?? ''}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-y-2">
                            <p className="text-sm text-gray-600 capitalize"><strong>Status:</strong> {item.paymentInfo?.status ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Item Total:</strong> {item.paymentInfo?.totalAmount ? item.paymentInfo.totalAmount/100 : 0}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Currency:</strong> {item.paymentInfo?.currency ?? ''}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-[350px] flex flex-col justify-start items-start">
                    <h2 className="text-lg text-gray-700">User Info:</h2>
                    <div className="w-full flex flex-col justify-start items-start gap-2 my-5">
                        <p className="text-sm text-gray-600 capitalize"><strong>Customer Name:</strong> {item.user?.name ?? ''}</p>
                        <p className="text-sm text-gray-600"><strong>Customer Email:</strong> {item.user?.email ?? ''}</p>
                        {
                            item.user?.phone ?
                            <p className="text-sm text-gray-600 capitalize"><strong>Customer Phone:</strong> {item.user?.phone ?? ''}</p>
                            :
                            null
                        }
                        <p className="text-sm text-gray-600 capitalize"><strong>Amount:</strong> {item.shipping?.method.amount ?? ''}</p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
                <h2 className="text-lg text-gray-700">Purchased Items:</h2>
                <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(100px,150px))] gap-6 mt-5">
                    {
                        item.items.map(itm => <div key={itm._id} className="w-full h-full flex flex-col justify-start items-center">
                            <div className="relative w-full h-[150px] flex justify-center items-center">
                                <Image src={itm.image}
                                        alt="#"
                                        fill
                                        className="object-cover" />
                            </div>
                            <div className="w-full flex flex-col justify-start items-start mt-2">
                                <p className="text-sm text-gray-600 capitalize">Title: {itm.name}</p>
                                <p className="text-sm text-gray-600 capitalize">Price: {itm.prices}</p>
                                <p className="text-sm text-gray-600 capitalize">Category : {itm.categoryName}</p>
                                <p className="text-sm text-gray-600 capitalize">On sale {itm.isSale ? 'Yes' : 'No'}</p>
                            </div>
                        </div>)
                    }
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-start">
                <h4 className="text-gray-600 text-md font-semibold">Change Order Status:</h4>
                <div className="w-full flex justify-start items-center mt-5 gap-x-5">
                    <button className="w-[200px] h-[40px] bg-gray-500 text-white
                                        disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={item.status === 'PENDING'}
                            onClick={() => updateOrderStatus('PENDING')}>
                        Pending
                    </button>
                    <button className="w-[200px] h-[40px] bg-blue-700 text-white
                                        disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={item.status === 'PROCESSING'}
                            onClick={() => updateOrderStatus('PROCESSING')}>
                        Processing
                    </button>
                    <button className="w-[200px] h-[40px] bg-green-600 text-white
                                        disabled:bg-green-300 disabled:cursor-not-allowed"
                                        disabled={item.status === 'DELIVERED'}
                            onClick={() => updateOrderStatus('DELIVERED')}>
                        Delivered
                    </button>
                    <button className="w-[200px] h-[40px] bg-red-500 text-white
                                        disabled:bg-red-200 disabled:cursor-not-allowed"
                            disabled={item.status === 'CANCELED'}
                            onClick={() => updateOrderStatus('CANCELED')}>
                        Canceled
                    </button>
                </div>
            </div>

            <button className="w-[200px] h-[40px] bg-red-600 text-white"
                    disabled={removeBtnDisable}
                    onClick={() => setDisplayWarningMsg(true)}>
                Remove This Order
            </button>
        </div>
        <hr className="w-full h-[2px] bg-gray-500 mx-auto my-10 rounded-full"/>
        </>
    )
}
