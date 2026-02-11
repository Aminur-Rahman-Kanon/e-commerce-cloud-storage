import { models, model, Schema } from 'mongoose';

const OrderSchema = new Schema({
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELED'],
        default: 'PENDING'
    },
    items: [
        {
            _id: String,
            name: String,
            slug: String,
            details: String,
            description: String,
            categoryId: String,
            categoryName: String,
            // size: String,
            prices: Number,
            image: String,
            isSale: Boolean
        }
    ],
    user: {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
        address: Object,
    },
    paymentInfo: {
        status: {
            type: String,
            enum: ['PENDING', 'PAID'],
            default: 'PENDING'
        },
        totalAmount: Number,
        currency: String,
        cardInfo: Object,
        stripeSessionId: String,
        stripePaymentIntentId: String
    },
    shipping: {
        customerName: { type: String, trim: true },
        address: Object,
        method: Object,
    }
},
{
    timestamps: true
});

export default models.order || model('order', OrderSchema);
