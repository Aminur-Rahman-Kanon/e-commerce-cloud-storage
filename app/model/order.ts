import { models, model, Schema } from 'mongoose';

const OrderSchema = new Schema({
    status: {
        type: String,
        enum: ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELED'],
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
            isSale: Boolean,
            quantity: Number
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
        stripePaymentIntentId: String,
        orderedTime: String
    },
    shipping: {
        customerName: { type: String, trim: true },
        address: Object,
        method: Object,
        isShipping: { type: Boolean, default: false, required: true },
        estimatedShipping: String,
    },
    delivery: {
        isDelivered: { type: Boolean, default: false, required: true },
        deliveredDate: String,
        deliveredAddress: String
    }
},
{
    timestamps: true
});

export default models.order || model('order', OrderSchema);
