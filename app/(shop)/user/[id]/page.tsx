import { getUserOrders } from "@/lib/user";
import User from "../../components/user/user";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function Page ({ params }: PageProps) {

    const {id } = await params;
    const order = await getUserOrders(id);
    
    if (!order) return;

    return (
        <div>
            <User item={order} />
        </div>
    )
}