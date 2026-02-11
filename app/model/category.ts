import { models, model, Schema } from "mongoose";
import '@/app/model/items';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

export const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    image: String,
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

CategorySchema.plugin(mongooseLeanVirtuals);

CategorySchema.virtual("items", {
    ref: 'item',
    localField: '_id',
    foreignField: 'categoryId'
});

export const Category = models.category || model('category', CategorySchema);