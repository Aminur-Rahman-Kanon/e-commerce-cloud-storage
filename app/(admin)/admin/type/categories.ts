import { ItemType } from "./items";

export type CategoriesType = {
    _id: string,
    name: string,
    slug: string,
    description: string,
    items: ItemType[] | undefined,
    image: string,
    isActive: boolean
};

