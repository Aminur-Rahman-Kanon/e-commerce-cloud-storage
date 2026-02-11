export const runtime = "nodejs";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import order from "@/app/model/order";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const signature = req.headers.get('stripe-signature')!;
    
    if (!signature) {
        return NextResponse.json(
            { error: 'Missing Stripe signature' },
            { status: 400 }
        )
    }

    const body = await req.text();

    try {
        const event = stripe.webhooks.constructEvent(
            body, signature, process.env.STRIPE_WEBHOOK_SECRET!
        );
    
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
    
            const paymentIntent = await stripe.paymentIntents.retrieve(
                session.payment_intent as string,
                {
                    expand: ['latest_charge.payment_method_details.card'],
                }
            );
    
            const card = (paymentIntent as any).latest_charge?.payment_method_details?.card;
    
            const cardInfo = {
                brand: card?.brand,
                last4: card?.last4,
                expMonth: card?.exp_month,
                expYear: card?.exp_year,
            };
    
            let shippingMethod = null;
    
            if (session.shipping_cost?.shipping_rate) {
                const shippingRate = await stripe.shippingRates.retrieve(
                    session.shipping_cost.shipping_rate as string
                );
    
                shippingMethod = {
                    code: shippingRate.metadata.code,
                    label: shippingRate.metadata.label,
                    amount: session.shipping_cost.amount_total,
                };
            }

            const updateData = {
                user: {
                    name: session.customer_details?.name,
                    email: session.customer_details?.email,
                    phone: session.customer_details?.phone,
                    address: session.customer_details?.address,
                },
                paymentInfo: {
                    status: 'PAID',
                    totalAmount: session.amount_total,
                    currency: session.currency,
                    cardInfo: cardInfo,
                    stripeSessionId: session.id,
                    stripePaymentIntentId: paymentIntent.id
                },
                shipping: {
                    customerName: session.customer_details?.name,
                    address: session.customer_details?.address,
                    method: shippingMethod
                }
            }
    
            await order.updateOne(
                { _id: session.metadata?.orderId! },
                { $set: updateData }
            )
    
        }
        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
