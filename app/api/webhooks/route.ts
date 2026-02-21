export const runtime = "nodejs";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import order from "@/app/model/order";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

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

            const orderedTime = new Date().toISOString();

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
                    stripePaymentIntentId: paymentIntent.id,
                    orderedTime: orderedTime
                },
                shipping: {
                    customerName: session.customer_details?.name,
                    address: session.customer_details?.address,
                    method: shippingMethod,
                    isShipping: false
                },
                delivery: {
                    isDelivered: false,
                }
            }
    
            await order.updateOne(
                { _id: session.metadata?.orderId! },
                { $set: updateData }
            ).catch(err => console.log(err))

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: session.customer_details?.email!,
                subject: "Order Confirmed!",
                html: `<div class="width:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;gap:15px;">
                    <h1 class="font-size:1.5rem;font-weight:bold;">
                        Thank you for your order, ${session.customer_details?.name?.toUpperCase()}
                    </h1>
                    <div class="width:100%;gap:15px;">
                        <p class="font-size:12px;">
                            Address: ${session.customer_details?.address?.line1 ?? 'no information'}
                        </p>
                        <p class="font-size:12px;">
                            City: ${session.customer_details?.address?.city ?? 'no information'}
                        </p>
                        <p class="font-size:12px;">
                            State: ${session.customer_details?.address?.state ?? 'no information'}
                        </p>
                        <p class="font-size:12px;">
                            Postal code: ${session.customer_details?.address?.postal_code ?? 'no information'}
                        </p>
                        <p class="font-size:12px;">
                            Country: ${session.customer_details?.address?.country ?? 'no information'}
                        </p>
                        <p class="font-size:12px;">
                            Email: ${session.customer_details?.email ?? 'no information'}
                        </p>
                        <p class="font-size:12px;">
                            Phone number: ${session.customer_details?.phone ?? 'no information'}
                        </p>
                        <p class="font-size:12px;">
                            Payment staus: Paid
                        </p>
                        <p class="font-size:12px;">
                            Shipping cost: ${session.shipping_cost?.amount_total ?? 0}
                        </p>
                        <p class="font-size:12px;">
                            Item total: ${session.amount_total ?? 0}
                        </p>
                    </div>
                </div>`,
            });
        }
        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
