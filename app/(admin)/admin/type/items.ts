import { Prisma } from "@prisma/client";

export type ItemType = {
    id: string,
    name: string,
    slug: string,
    details?: string,
    description?: string | null,
    categoryId: string,
    image: ImageType[],
    size: string[] | null,
    prices?: PriceType | null,
    isActive: boolean,
    isSpecial: boolean,
    isNew: boolean,
    isSale: boolean
}

export type ImageType = {
    readonly id?: string,
    itemId?: string,
    filename: string,
    url: string,
    order: number,
}


type SizeType = Prisma.JsonObject & {
  small: boolean;
  medium: boolean;
  large: boolean;
};

export type PriceType = {
    id?: string,
    base: string,
    discounted: string | null,
    itemId?: string,
}

export type CategoriesType = {
    name: string;
    id: string;
    slug: string;
    description: string;
    Items: ItemType[],
    image: string | null;
    isActive: boolean;
}


export type NewItemType = {
    name: string,
    slug: string,
    details: string,
    categoryId: string,
    description: string,
    size?: string[],
    prices: {
        base: string,
        discounted: string
    },
    isActive: boolean,
    isSpecial: boolean,
    isNew: boolean,
    isSale: boolean
}
