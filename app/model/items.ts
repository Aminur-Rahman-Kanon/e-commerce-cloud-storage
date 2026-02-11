import { models, model, Schema, Types } from "mongoose";

const ItemSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true },
    details: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    categoryId: { type: Types.ObjectId, ref: 'category', required: true },
    size: [{ type: String, trim: true }],
    prices: { base: {  type: Number, required: true}, discounted: Number },
    image: [String],
    isActive: { type: Boolean, default: true },
    isNewItem: { type: Boolean, default: true },
    isSpecial: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
}, {
    timestamps: true
})

export const Item = models.item || model('item', ItemSchema);
