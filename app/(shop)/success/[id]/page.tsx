import { getUserOrders } from "@/lib/user";
import { getCurrencySymbol } from "../../utilities/utilities";
import Link from "next/link";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function Page ({ params }: PageProps) {

    const { id } = await params;

    if (!id) return;

    const orderInfo = await getUserOrders(id);

    if (!orderInfo) return;

    const displayOrderStatus = orderInfo.paymentInfo?.status === 'PAID' ? <div className="w-full flex flex-col justify-center items-center gap-y-3">
        <div className="w-full flex justify-center items-center">
            {/*success emoji*/}
            <h1 className="text-2xl text-green-500 font-normal tracking">
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
    :
    <div className="w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl text-red-500 font-normal tracking">
            Payment information not available !
        </h1>
        <p className="text-sm text-gray-600">
            Please contact the team ASAP with the reference number
        </p>
    </div>

    return (
        <div className="w-full max-w-[1400px] mx-auto min-h-screen my-[50px]">
            {
                displayOrderStatus
            }
        </div>
    )
}