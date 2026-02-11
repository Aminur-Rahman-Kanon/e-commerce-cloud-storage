export type OrdersType = {
    readonly _id: string,
    status: string,
    items: Items[],
    user?: User,
    paymentInfo?: PaymentInfo,
    shipping?: Shipping,
    createdAt: string,
    updatedAt: string
}

type Items = {
    readonly _id: string,
    name: string,
    slug: string,
    details: string,
    description: string,
    categoryId: string,
    categoryName: string,
    prices: number,
    image: string,
    isSale: boolean
}

type User = {
    name: string,
    email: string,
    phone: string,
    address: Address
}

type Address = {
    city: string,
    country: string,
    line1: string,
    line2: string,
    postal_code: string,
    state?: string
}

type PaymentInfo = {
    status: string,
    totalAmount: number,
    currency: string,
    cardInfo: CardInfo,
    stripeSessionId: string,
    stripePaymentIntentId: string
}

type CardInfo = {
    brand: string,
    last4: string,
    expMonth: number,
    expYear: number
}

type Shipping = {
    customerName: string,
    address: Address,
    method: Method
}

type Method = {
    code: string,
    label: string,
    amount: number
}
