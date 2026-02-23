import { getSingleCategory } from "@/lib/items";
import Category from "../../components/category/category";


type PageProps = {
    params: Promise<{ id: string }>
}

export default async function Page ({ params }: PageProps) {

    const { id } = await params;

    if (!id) return;

    const decodedParams = decodeURIComponent(id);

    const cat = await getSingleCategory(decodedParams);

    if (!cat) return;

    return (
        <div className="w-full min-h-screen">
            <Category category={cat} />
        </div>
    )
}