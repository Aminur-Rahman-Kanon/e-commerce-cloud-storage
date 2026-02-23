import { ItemType } from "@/app/(admin)/admin/type/items";
import { serializeCategory, serializeItem } from "@/app/(shop)/utilities/utilities";
import { Category } from "@/app/model/category";
import { Item } from "@/app/model/items";
import { connectDB } from '@/lib/mongodb';
import { Types } from 'mongoose'

export async function getCategories() {
  await connectDB();
  const categories = await Category.find({ isActive: true }).populate('items').lean({ virtuals: true });
  return categories.map(serializeCategory);
}

export async function getSingleCategory (name:string) {
    if (!name) return;

    try {
        const category = await Category.findOne({ name }).populate('items').lean({ virtuals: true });
        return serializeCategory(category);
    } catch (error) {
        console.error(error);
    }
}

export async function getSingleItem(id: string): Promise<ItemType | null> {
    await connectDB();

    if (!id || !Types.ObjectId.isValid(id)) {
        return null;
    }

    try {
        const item = await Item.findById(id)
            .populate({ path: 'categoryId', select: 'name' })
            .lean();

        if (!item) return null;

        return serializeItem(item);
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}
