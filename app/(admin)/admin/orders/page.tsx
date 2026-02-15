'use client';

import { useEffect, useState } from "react";
import { OrdersType } from "../type/orders";
import OrderCard from "../component/orderCard/orderCard";

export default function Page() {

    const [orders, setOrders] = useState<OrdersType[]>([])

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/admin/orders');
            const order = await res.json();
            if (order.orders){
                setOrders(order.orders);
            }
        })()
    }, []);

    return orders.length ? <div className="w-full flex flex-col justify-center items-center gap-3 p-5">
        <h1 className="text-xl text-gray-600 font-semibold">Orders</h1>
        <div className="w-full flex flex-col items-start">
            {
                orders.map(odr => <OrderCard key={odr._id} product={odr} />)
            }
        </div>
    </div>
    :
    <div>
        No Orders Yet
    </div>
}
