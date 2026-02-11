'use server';

import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { BasketItem } from '../(shop)/context/basketProvider/basketProvider';
import createTempOrder from '@/services/order.';
import { expressShipping, standardShipping, SupportedCurrency } from '../(admin)/admin/utilities/utilities';

export async function createCheckout(basket: BasketItem[], curr: SupportedCurrency) {
    if (!basket || !curr) throw new Error('no price_info provided!');

    const headersList = headers();
    const origin = (await headersList).get('origin');

    //create order document
    const order = await createTempOrder(basket);

    const lineItems = basket.map((baskt) => ({
        price_data: {
            currency: curr,
            product_data: {
            name: baskt.item.name,
            description: baskt.item.details ?? '',
            images: baskt.item.image,
            },
            unit_amount: baskt.item.prices?.discounted ?
                         baskt.item.prices?.discounted * 100
                         :
                         baskt.item.prices?.base! * 100
        },
        quantity: baskt.quantity,
    }));

    const shippingOptions = [
        standardShipping(curr),
        expressShipping(curr),
    ].filter(Boolean) as Stripe.Checkout.SessionCreateParams.ShippingOption[];

    type AllowedCountry = Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry;

    const EU_COUNTRIES = [
        'FR','DE','IT','ES','NL','BE','AT','PT','IE','FI','SE','DK','PL','CZ','HU','RO',
        'BG','HR','SI','SK','LT','LV','EE','LU','MT','CY','GR'
    ] as const satisfies readonly AllowedCountry[];

    const allowedCountries = {
        eur: EU_COUNTRIES,
        usd: ['US'],
        gbp: ['GB'],
        cad: ['CA'],
    } satisfies Record<SupportedCurrency, readonly AllowedCountry[]>;



    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        shipping_address_collection: {
            allowed_countries: [...allowedCountries[curr]]
        },
        shipping_options: shippingOptions,
        success_url: `${origin}/success`,
        cancel_url: `${origin}/cancel`,
        metadata: {
            orderId: order._id.toString(),
        }
    });

    redirect(session.url!);
}
