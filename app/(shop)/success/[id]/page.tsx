import { getUserOrders } from "@/lib/user";
import SuccessPageLayout from "../../components/successPageLayout/successPageLayout";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function Page ({ params }: PageProps) {

    const { id } = await params;

    if (!id) return;

    const orderInfo = await getUserOrders(id);

    if (!orderInfo) return;

    const displayOrderStatus = orderInfo.paymentInfo?.status === 'PAID' ? <SuccessPageLayout orderInfo={orderInfo} />
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