import { ItemType } from "@/app/(admin)/admin/type/items";
import { prisma } from "@/lib/prisma";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:3000";


export async function getCategories() {
  const categories = await prisma.category.findMany({
        where: {
            isActive: true
        },
        include: {
            Items: {
                where: {
                    isActive: true,
                },
                include: {
                    image: true,
                    prices: true
                }
            }
        }
    })

    return categories.map(cat => ({
        ...cat,
        Items: cat.Items.map(itm => ({
            id: itm.id,
            name: itm.name,
            slug: itm.slug,
            details: itm.details ?? undefined,
            description: itm.description ?? undefined,
            categoryId: itm.categoryId,
            image: itm.image,
            size: itm.size as string[] | null,
            prices: itm.prices!,
            isActive: itm.isActive,
            isSpecial: itm.isSpecial,
            isNew: itm.isNew,
            isSale: itm.isSale,
        })),
    }))
}


export async function getSingleProduct (id:string):Promise<ItemType | null> {
    if (!id) null;

    try {
        const productPromise = await fetch(`${baseUrl}/api/shop/item/${id}`, {
            cache: 'no-cache'
        });
        
        if (!productPromise.ok) return null;
        const product = await productPromise.json();
        return product;
    } catch (error) {
        return null;
    }
}
