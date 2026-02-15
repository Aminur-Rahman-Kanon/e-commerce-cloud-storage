import { BasketItem } from "@/app/(shop)/context/basketProvider/basketProvider";
import order from "@/app/model/order";
import { connectDB } from "@/lib/mongodb";

export default async function createTempOrder(basket:BasketItem[]) {
    if (!basket.length) return;

    basket.forEach(itm => console.log(itm.item.prices))

    try {
        await connectDB();
        
        const items = basket.map(itm => ({
            ...itm.item,
            categoryId: itm.item.categoryId.toString(),
            prices: itm?.item?.prices?.discounted ?? itm?.item?.prices?.base,
            image: itm.item.image[0],
            quantity: itm.quantity
            // size: itm.item.size?.[0] ?? ''
        }))

        const orderObj = await order.create({
            status: 'PENDING',
            items: items,
        })

        return orderObj;
    } catch (error) {
        if (error instanceof Error){
            throw error;
        }

        throw new Error('unknowm error occured!')
    }
}