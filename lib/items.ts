import { ItemType } from "@/app/(admin)/admin/type/items";
import { serializeCategory, serializeItem } from "@/app/(shop)/utilities/utilities";
import { Category } from "@/app/model/category";
import { Item } from "@/app/model/items";
import { connectDB } from '@/lib/mongodb';
import { Types } from 'mongoose'

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:3000";


export async function getCategories() {
  await connectDB();
  const categories = await Category.find({ isActive: true }).populate('items').lean({ virtuals: true });
  return categories.map(serializeCategory);
}


export async function getSingleItem(id: string): Promise<ItemType | null> {
    console.log("Fetching item:", id);

    if (!id || !Types.ObjectId.isValid(id)) {
        console.log("Invalid ID");
        return null;
    }

    try {
        const item = await Item.findById(id)
            .populate({ path: 'categoryId', select: 'name' })
            .lean();

        console.log("DB result:", item);

        if (!item) return null;

        return serializeItem(item);
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

