export type ItemType = {
    readonly _id?: string,
    name: string,
    slug: string,
    details?: string | null,
    description?: string | null,
    categoryId: string,
    categoryName: string,
    image: string[],
    size: string[] | null,
    prices?: PriceType,
    isActive: boolean,
    isSpecial: boolean,
    isNewItem: boolean,
    isSale: boolean
}

export type PriceType = {
    base: number,
    discounted?: number | undefined,
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
