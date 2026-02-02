'use client';

import Image from "next/image";
import { useBasket } from "../context/basketProvider/basketProvider";
import { useState } from "react";

export default function Page () {
    // const { addItem, removeItem, items, count } = useBasket();

    // const [shiipping, setShipping] = useState(70);

    // const subTotal = items.reduce((acc, itm) => {
    //     const price = Number(itm.item.prices.discounted) > 0 ? 
    //         Number(itm.item.prices.discounted) : Number(itm.item.prices.base);
        
    //         return acc + price * itm.quantity
    // }, 0)

    // const total = subTotal + shiipping;

    // return (
    //     <div className="w-full max-w-[1800px] min-h-[700px] mx-auto my-[50px] p-5
    //                     flex flex-col justify-start items-center gap-y-10">
    //         <h1 className="text-lg font-bold">Shopping Cart</h1>

    //         <div className="w-full h-full flex justify-center items-start
    //                         flex-col gap-y-10
    //                         lg:flex-row">
    //             <div className="w-full h-full flex justify-center items-start
    //                             lg:w-[calc(100%-480px)]">
    //                 {
    //                     items.length ? items.map(itm => <div key={itm.item.id} className="w-full flex justify-between items-center
    //                                                                                     xl:justify-around">
    //                         <div className="flex justify-center items-center">
    //                             <div className="flex justify-center items-center p-2">
    //                                 <Image src={itm.item.image[0].url}
    //                                         alt={itm.item.name}
    //                                         width={50}
    //                                         height={70}
    //                                         className="object-cover" />
    //                             </div>
    //                             <div className="w-[120px] flex flex-col justify-center items-start p-2 gap-y-2
    //                                             sm:w-[200px]">
    //                                 <p className="text-xs font-normal w-[100px] truncate">
    //                                     {itm.item.id}
    //                                 </p>
    //                                 <h4 className="text-xs text-gray-600 font-semibold capitalize">
    //                                     { itm.item.name }
    //                                 </h4>
    //                             </div>
    //                         </div>

    //                         <div className="w-[75px] p-1 flex justify-center items-center border border-gray-300 rounded
    //                                         md:w-[105px]">
    //                             <button className="w-[25px] h-[25px] rounded"
    //                                     onClick={() => removeItem(itm.item.id)}>
    //                                 -
    //                             </button>
    //                             <span className="w-[25px] h-[25px] flex justify-center items-center text-sm font-normal text-gray-600">
    //                                 { itm.quantity }
    //                             </span>
    //                             <button className="w-[25px] h-[25px] rounded"
    //                                     onClick={() => addItem(itm)}>
    //                                 +
    //                             </button>
    //                         </div>

    //                         <div className="block w-100px text-sm font-normal text-gray-700">
    //                             &#2547;{
    //                                 Number(itm.item.prices.discounted) > 0 ?
    //                                 Number(itm.item.prices.discounted) * itm.quantity : Number(itm.item.prices.base)*itm.quantity
    //                             }
    //                         </div>
    //                     </div>)
    //                     :
    //                     'No Items'
    //                 }
    //             </div>
                
    //             <div className="w-full flex flex-col justify-start items-start
    //                             lg:w-[300px]
    //                             xl:w-[480px]">
    //                 <h2 className="text-md font-semibold text-gray-500 my-3">
    //                     Summary
    //                 </h2>
    //                 <div className="w-full flex flex-col justify-center items-start my-5">
    //                     <div className="w-full flex flex-col justify-center items-center gap-y-2">
    //                         <div className="w-full flex justify-between items-center">
    //                             <p className="text-xs font-normal">Subtotal</p>
    //                             <p className="text-xs font-normal">&#2547;{subTotal}</p>
    //                         </div>
    //                         <div className="w-full flex justify-between items-center">
    //                             <p className="text-xs font-normal">Shipping</p>
    //                             <select className="w-[200px]"
    //                                 onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setShipping(Number(e.target.value))}>
    //                                 <option disabled>Please Select</option>
    //                                 <option value={70}>Inside Dhaka (70)</option>
    //                                 <option value={150}>Outside Dhaka (150)</option>
    //                             </select>
    //                         </div>
    //                         <div className="w-full flex justify-between items-center mt-5">
    //                             <h4 className="text-sm font-semibold text-gray-700">Total</h4>
    //                             <p className="text-xs font-normal">&#2547;{ total }</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <button className="w-full h-[40px] bg-gray-500 text-white text-sm font-normal
    //                                     hover:bg-gray-600">
    //                     Check Out
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // )
}