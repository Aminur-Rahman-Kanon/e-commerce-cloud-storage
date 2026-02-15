import { connectDB } from "./mongodb";
import order from "@/app/model/order";
import { OrdersType } from "@/app/(admin)/admin/type/orders";
import { notFound } from "next/navigation";

export async function getUserOrders (id:string): Promise<OrdersType | null> {
    if (!id) return null;

    console.log(id);

    try {
        await connectDB();
        const orders = await order.findOne({ _id: id }).lean();
        const user = {
            ...orders,
            _id: orders._id.toString(),
            createdAt: orders.createdAt.toISOString(),
            updatedAt: orders.updatedAt.toISOString(),
        }

        return user;
    } catch (error) {
        if (error instanceof Error){
            throw new Error(error.message)
        }

        console.error('unexpected behavior');
        return null;
    }
}