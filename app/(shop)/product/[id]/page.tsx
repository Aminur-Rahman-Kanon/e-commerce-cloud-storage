export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Product from "../../components/product/product";
import { notFound } from "next/navigation";
import { getSingleItem } from "@/lib/items";


type PageProps = {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: PageProps):Promise<Metadata>{
    const { id } = await params;
    
    if (!id) return {
        title: 'Product Not Found',
        robots: { index: true }
    }

    const product = await getSingleItem(id);

    if (!product) return {
        title: 'Product Not Found',
        robots: { index: true }
    }

    return {
        title: product.name,
        description: product.details,
        openGraph: {
            title: product.name,
            description: product.details ?? '',
            images: [
                {
                    url: product.image[0],
                    alt: product.name
                }
            ]
        }
    }
}

export default async function Page ({ params }: PageProps) {
    const { id } = await params;

    const product = await getSingleItem(id);

    if (!product) {
        return notFound()
    };

    return (
        <div className="w-full my-15 lg:my-20">
            <Product product={product} />
        </div>
    )
}