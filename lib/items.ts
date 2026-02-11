import { ItemType } from "@/app/(admin)/admin/type/items";
import { serializeCategory, serializeItem } from "@/app/(shop)/utilities/utilities";
import { Category } from "@/app/model/category";
import { Item } from "@/app/model/items";
import { connectDB } from '@/lib/mongodb';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:3000";


export async function getCategories() {
  await connectDB();
  const categories = await Category.find({ isActive: true }).populate('items').lean({ virtuals: true });
  return categories.map(serializeCategory);
}


export async function getSingleItem (id:string):Promise<ItemType | null> {
    if (!id) null;

    try {
        const item = await Item.findOne({ _id: id }).populate({ path: 'categoryId', select: 'name' }).lean();
        return serializeItem(item);
    } catch (error) {
        return null;
    }
}
