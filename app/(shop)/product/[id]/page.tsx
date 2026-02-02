import { ItemType } from "@/app/(admin)/admin/type/items";
import { Metadata } from "next";
import Product from "../../components/product/product";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

    const product = await prisma.item.findUnique({
        where: {
            id: id
        },
        include: {
            image: true,
            prices: true
        }
    })

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
                    url: product.image[0].url,
                    alt: product.name
                }
            ]
        }
    }
}

export default async function Page ({ params }: PageProps) {
    const { id } = await params;

    const product = await prisma.item.findUnique({
        where: {
            id: id
        },
        include: {
            image: true,
            prices: true
        }
    })

    if (!product) {
        return notFound()
    };

      const transformedProduct: ItemType = {
        ...product,
        description: product.description || undefined, // Convert null to undefined
        details: product.details || undefined,
        image: product.image || [],
        prices: product.prices || undefined,
        size: product.size ? JSON.parse(JSON.stringify(product.size)) : undefined
    };

    return (
        <div className="w-full my-15 lg:my-20">
            <Product product={transformedProduct} />
        </div>
    )
}