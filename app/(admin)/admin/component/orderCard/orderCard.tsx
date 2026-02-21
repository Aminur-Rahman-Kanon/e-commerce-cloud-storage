'use client';

import Image from "next/image";
import { OrdersType } from "../../type/orders";
import { countryCodeToName } from "../../utilities/utilities";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import Modal from "@/app/(shop)/components/layout/modal/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { formateDatTime } from '@/app/(shop)/utilities/utilities';

type Props = {
    product: OrdersType
}

type Status = 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'CANCELED'

export default function OrderCard({ product }: Props) {
    const [item, setItem] = useState<OrdersType | null>(null);
    const [orderCancelStatus, setOrderCancelStatus] = useState<boolean>(false)
    const [displayWarningMsg, setDisplayWarningMsg] = useState<boolean>(false);
    
    const [removeBtnDisable, setRemoveBtnDisable] = useState(false);
    const [warningMsgBtnSpinner, setWarningMsgBtnSpinner] = useState(false);
    const [warningMsgBtnDisable, setWarningMsgBtnDisable] = useState(false);

    const [shippingBtnSpinner, setShippingBtnSpinner] = useState<boolean>(false);
    const [shippingBtnDisable, setShippingBtnDisable] = useState<boolean>(false);

    const [deliveryBtnSpinner, setDeliveryBtnSpinner] = useState<boolean>(false);
    const [deliveryBtnDisable, setDeliveryBtnDisable] = useState<boolean>(false);

    const [cancelBtnSpinner, setCancelBtnSpinner] = useState<boolean>(false);
    const [cancelBtnDisable, setCancelBtnDisable] = useState<boolean>(false);

    const [resumeBtnSpinner, setResumeBtnSpinner] = useState<boolean>(false);
    const [resumeBtnDisable, setResumeBtnDisable] = useState<boolean>(false);

    const [isShipping, setIsShipping] = useState<boolean>(false);
    const [estimatedShipping, setEstimatedShipping] = useState<string>('');

    const [isDelivered, setIsDelivered] = useState<boolean>(false);
    const [deliveredDate, setDeliveredDate] = useState<string>('');

    const [deliveredAddress, setDeliveredAddress] = useState<string>('');

    useEffect(() => {
        if (product){
            setItem(product);
            if (item?.shipping?.isShipping !== undefined) setIsShipping(item.shipping.isShipping);
            if (item?.shipping?.estimatedShipping) setEstimatedShipping(item.shipping.estimatedShipping);
            if (item?.delivery.isDelivered !== undefined) setIsDelivered(item.delivery.isDelivered);
            if (item?.delivery.deliveredDate) setDeliveredDate(item.delivery.deliveredDate);
            if (item?.delivery.deliveredAddress) setDeliveredAddress(item.delivery.deliveredAddress);
            if (product.status === 'CANCELED') setOrderCancelStatus(true);
        }
    }, [product]);

    function shippingInputHandler (e:React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();

        const value = e.target.value === 'true' ? true : false;
        setIsShipping(value);

        if (!value) {
            setEstimatedShipping('');
        }
    }

    function deliveryInputHandler (e:React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();

        const value = e.target.value === 'true' ? true : false;
        setIsDelivered(value);
    }

    function orderCancelStatusHandler (e:React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();

        const value = e.target.value === 'true' ? true : false;
        setOrderCancelStatus(value);
    }

    async function cancelOrderHandler(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        setCancelBtnDisable(true);
        setCancelBtnSpinner(true);

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'CANCELED', id: item?._id })
            })
    
            setCancelBtnDisable(false);
            setCancelBtnSpinner(false);
    
            if (!res.ok) return toast.error('Order cancel failed!');
    
            const updatedStatus = await res.json();
            
            if (updatedStatus?.acknowledged && updatedStatus?.matchedCount > 0){
                setItem(prev => prev ? {
                    ...prev,
                    status: 'CANCELED'
                }: prev)
    
            }
            toast.success(`Order Canceled!`);
            return setTimeout(() => window.location.reload(), 1800);
        } catch (error) {
            setCancelBtnDisable(false);
            setCancelBtnSpinner(false);
            return toast.error('Update Failed!')
        }
    }

    async function resumeOrderHandler (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setResumeBtnDisable(true);
        setResumeBtnSpinner(true);

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'PENDING', id: item?._id })
            })

            setResumeBtnDisable(false);
            setResumeBtnSpinner(false);

            if (!res.ok) return toast.error('Update status to Canceled failed!');

            const updatedStatus = await res.json();

            if (updatedStatus?.acknowledged && updatedStatus?.matchedCount > 0){
                setItem(prev => prev ? {
                    ...prev,
                    status: 'PENDING'
                }: prev)

                const cancelElement = document.getElementById('cancel') as HTMLSelectElement;

                if (cancelElement){
                    cancelElement.value = 'false';
                }
            }

            toast.success('Order status update to Pending\nYou should update status to shipping or delivered');
            return setTimeout(() => window.location.reload(), 1800);
        } catch (error) {
            setResumeBtnDisable(false);
            setResumeBtnSpinner(false);
            return toast.error('Server error');
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
        setDisplayWarningMsg(false);

        return setTimeout(() => {
            window.location.reload();
        }, 1700)
    }

    async function shippingSubmitHandler (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        if (!isShipping || !estimatedShipping) return toast.error('Please provide all information')
        
        setShippingBtnDisable(true);
        setShippingBtnSpinner(true);

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: item?._id,
                    section: 'shipping',
                    data: {
                        isShipping, estimatedShipping
                    },
                    status: 'SHIPPING'
                })
            })

            setShippingBtnDisable(false);
            setShippingBtnSpinner(false);
    
            if (!res.ok) return toast.error('Update Failed!');
            
            toast.success('Order Updated!');
            return setTimeout(() => window.location.reload(), 1800);
        } catch (error) {
            setShippingBtnDisable(false);
            setShippingBtnSpinner(false);
            return toast.error('Server error')
        }
    }

    async function deliverySubmitHandler (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!isDelivered || !deliveredDate || !deliveredAddress) return toast.error('Please provide all information')
        
        setDeliveryBtnDisable(true);
        setDeliveryBtnSpinner(true);

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: item?._id,
                    section: 'delivery',
                    data: {
                        isDelivered, deliveredAddress, deliveredDate
                    },
                    status: 'DELIVERED'
                })
            })

            setDeliveryBtnDisable(false);
            setDeliveryBtnSpinner(false);
    
            if (!res.ok) return toast.error('Update Failed!')
            
            toast.success('Order Updated!');
            return setTimeout(() => window.location.reload(), 1800);
        } catch (error) {
            setDeliveryBtnDisable(false);
            setDeliveryBtnSpinner(false);
            return toast.error('Server error')
        }
    }

    function deliverySectionDisableHandler ():boolean {
        const isShipped = item?.shipping?.isShipping;
        const isDelived = item?.delivery.isDelivered;

        if (item?.status === 'CANCELED') return true;
        if (isShipped && !isDelived) return false;
        return true;
    }

    if (!item) return;

    let statusTextClass = 'text-gray-500'
    if (item.status === 'SHIPPING'){
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
            <p className="text-sm text-gray-600 capitalize"><strong>Order Placed:</strong> {
                item.paymentInfo?.orderedTime ? formateDatTime(item.paymentInfo.orderedTime) : 'No information'
            }</p>
            <h3 className="text-gray-600 font-semibold">Order Status: <strong className={statusTextClass}>{item.status}</strong></h3>
            <div className="w-full flex flex-wrap justify-start items-start gap-[50px]">
                <div className="w-full max-w-[350px] flex flex-col justify-start items-start">
                    <h2 className="text-lg text-gray-700">Shipping Info:</h2>
                    <div className="w-full flex justify-start items-start gap-5 my-5">
                        <div className="flex flex-col justify-start items-start gap-y-3">
                            <p className="text-sm text-gray-600 capitalize"><strong>Line 1:</strong> {item.shipping?.address?.line1 ?? ''}</p>
                            {
                                item.shipping?.address?.line2 ? 
                                <p className="text-sm text-gray-600 capitalize"><strong>Line 2:</strong> {item.shipping?.address?.line2 ?? ''}</p>
                                :
                                null
                            }
                            <p className="text-sm text-gray-600 capitalize"><strong>Postal Code:</strong> {item.shipping?.address?.postal_code ?? ''}</p>
                            {
                                item.shipping?.address?.state ?
                                <p className="text-sm text-gray-600 capitalize"><strong>State:</strong> {item.shipping?.address?.state ?? ''}</p>
                                :
                                null
                            }
                            <p className="text-sm text-gray-600 capitalize"><strong>City:</strong> {item.shipping?.address?.city ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Country:</strong> {item.shipping?.address?.country ? countryCodeToName(item.shipping?.address.country) : ''}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-y-3">
                            <p className="text-sm text-gray-600 capitalize"><strong>Delivery:</strong> {item.shipping?.method?.label  ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Customer Name:</strong> {item.shipping?.customerName ?? ''}</p>
                            <p className="text-sm text-gray-600 capitalize"><strong>Amount:</strong> {item.shipping?.method?.amount ? item.shipping?.method?.amount / 100 : ''}</p>
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
                        <p className="text-sm text-gray-600 capitalize"><strong>Amount:</strong> {item.shipping?.method?.amount ?? ''}</p>
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
                                <p className="text-sm text-gray-600 capitalize">Quantity: {itm.quantity}</p>
                                <p className="text-sm text-gray-600 capitalize">Category : {itm.categoryName}</p>
                                <p className="text-sm text-gray-600 capitalize">On sale {itm.isSale ? 'Yes' : 'No'}</p>
                            </div>
                        </div>)
                    }
                </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-y-5">
                <h2 className="text-md text-gray-500 font-semibold">Actions: </h2>
                <div className="w-full flex flex-wrap justify-start items-start gap-7">
                    <form className="w-[300px] flex flex-col justify-center items-start"
                        onSubmit={shippingSubmitHandler}>
                        <fieldset className="w-full flex flex-col justify-center items-start gap-y-5
                                            disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={item?.delivery?.isDelivered || item.status === 'CANCELED'}>
                            <h4 className="text-gray-600 text-md font-semibold">Shipping Order:</h4>
                            <div className="w-full flex flex-col justify-center items-start  gap-y-5">
                                <div className="w-full flex flex-col justify-center items-start  gap-y-2">
                                    <label htmlFor="shipping"
                                            className="text-sm text-gray-600">
                                        Ship this Order ?
                                    </label>
                                    <select name="shipping"
                                            id="shipping"
                                            defaultValue={item.shipping?.isShipping+'' || 'Please Select'}
                                            className="w-full max-w-[300px] pl-2 border border-gray-300 bg-white"
                                            onChange={shippingInputHandler}>
                                        <option disabled>Please Select</option>
                                        <option value={'true'}>Yes</option>
                                        <option value={'false'}>No</option>
                                    </select>
                                </div>
                                <div className="w-full flex flex-col justify-center items-start">
                                    <p className="text-sm text-gray-600">Estimated Date: </p>
                                    <input type="date"
                                            id="estimatedShipping"
                                            value={item.shipping?.estimatedShipping}
                                            disabled={!isShipping}
                                            className="w-full pl-2 border border-gray-300 bg-white"
                                            onChange={(e) => setEstimatedShipping(e.target.value)} />
                                </div>
                                <button className="w-full h-[40px] bg-blue-700 text-white
                                                    disabled:bg-blue-300 disabled:cursor-not-allowed"
                                        disabled={shippingBtnDisable}
                                        type="submit" >
                                    {
                                        shippingBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse />
                                        :
                                        'Ship this Order'
                                    }
                                </button>
                            </div>
                        </fieldset>
                    </form>
                    <form className='w-[300px] flex flex-col justify-center items-start'
                        onSubmit={deliverySubmitHandler}>
                        <fieldset disabled={deliverySectionDisableHandler()}
                                    className="w-full flex flex-col justify-center items-start  gap-y-5
                                            disabled:opacity-50 disabled:cursor-not-allowed">
                            <h4 className="text-gray-600 text-md font-semibold">Order Delivery:</h4>
                            <label htmlFor="delivery" className="text-sm text-gray-600">
                                Order delivered ?
                            </label>
                            <select id="delivery"
                                    name="delivery"
                                    defaultValue={item?.delivery?.isDelivered +''}
                                    onChange={deliveryInputHandler}
                                    className="w-full pl-2 border border-gray-300 bg-white" >
                                <option disabled>Please Select</option>
                                <option value={'true'}>Yes</option>
                                <option value={'false'}>No</option>
                            </select>
                            <div className="w-full flex flex-col justify-center items-start">
                                <p className="text-sm text-gray-600">Delivered Date: </p>
                                <input type="date"
                                        id="deliveredDate"
                                        value={item?.delivery?.deliveredDate || deliveredDate}
                                        className="w-full pl-2 border border-gray-300 bg-white"
                                        onChange={(e) => setDeliveredDate(e.target.value)} />
                            </div>
                            <div className="w-full flex flex-col justify-center items-start">
                                <p className="text-sm text-gray-600">Delivered Address: </p>
                                <textarea id="deliveredAddress"
                                        value={deliveredAddress}
                                        className="w-full pl-2 border border-gray-300 bg-white"
                                        placeholder="Delivered Address"
                                        onChange={(e) => setDeliveredAddress(e.target.value)} />
                            </div>
                            <button className="w-full h-[40px] bg-green-600 text-white
                                                disabled:bg-green-300 disabled:cursor-not-allowed"
                                    disabled={deliveryBtnDisable}>
                                {
                                    deliveryBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse />
                                    :
                                    'Item Delivered'
                                }
                            </button>
                        </fieldset>
                    </form>
                    <div className='w-[300px] flex flex-col justify-start items-start gap-y-5'>
                        <form className='w-full flex flex-col justify-center items-start gap-y-5'
                            onSubmit={cancelOrderHandler}>
                            <fieldset disabled={item.status === 'CANCELED' || item.status === 'DELIVERED'}
                                    className='w-full flex flex-col justify-center items-start gap-y-5'>
                                <h4 className="text-gray-600 text-md font-semibold">Cancel Order:</h4>
                                <label htmlFor="delivery" className="text-sm text-gray-600">
                                    Cancel Order ?
                                </label>
                                <select id="cancel"
                                        name="cancel"
                                        defaultValue={orderCancelStatus +''}
                                        onChange={orderCancelStatusHandler}
                                        className="w-full pl-2 border border-gray-300 bg-white">
                                    <option disabled>Please Select</option>
                                    <option value={'true'}>Yes</option>
                                    <option value={'false'}>No</option>
                                </select>
                                <button className="w-full h-[40px] bg-red-700 text-white cursor-pointer
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!orderCancelStatus || cancelBtnDisable}
                                        type="submit">
                                    {
                                        cancelBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse />
                                                            :
                                                            'Cancel Order'
                                    }
                                </button>
                            </fieldset>
                        </form>
                        <form className="w-full flex flex-col justify-start items-start gap-y-5"
                            onSubmit={resumeOrderHandler}>
                            <h4>Want to resume the Order ?</h4>
                            <button className="w-full h-[40px] bg-green-600 text-white cursor-pointer
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.status !== 'CANCELED'}
                                    type="submit" >
                                {
                                    resumeBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse />
                                                        :
                                                        'Resume Order'
                                }
                            </button>
                        </form>
                    </div>

                    <form className="w-[300px] flex flex-col justify-center items-start gap-y-5">
                        <h4 className="text-gray-600 text-md font-semibold">Remove Order:</h4>
                        <label htmlFor="delivery" className="text-sm text-gray-600">
                            Remove this Order ?
                        </label>
                        <button className="w-full h-[40px] bg-red-600 text-white"
                                disabled={removeBtnDisable}
                                onClick={() => setDisplayWarningMsg(true)}>
                            Remove This Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <hr className="w-full h-[2px] bg-gray-500 mx-auto my-10 rounded-full"/>
        </>
    )
}
