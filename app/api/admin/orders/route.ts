import { connectDB } from "@/lib/mongodb";
import order from "@/app/model/order";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const stringyOrders = await order.find().lean().sort({ createdAt: -1 });

        if (!stringyOrders.length) return NextResponse.json( [], { status: 200 } );
        const orders = stringyOrders.map(odr => ({
            ...odr,
            createdAt: odr.createdAt.toISOString(),
            updatedAt: odr.updatedAt.toISOString()
        }))

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const { status, id } = await req.json();

    try {
        await connectDB();
        const updatedData = await order.findByIdAndUpdate(
            { _id: id },
            { $set: {
                status,
                'shipping.isShipping': false,
                'shipping.estimatedShipping': '',
                'delivery.isDelivered': false,
                'delivery.deliveredAddress': '',
                'delivery.deliveredDate': ''
            }}, { new: true }
        )

        return NextResponse.json(updatedData, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })   
    }
}

export async function DELETE(req: NextRequest){
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: 'no info provided' }, { status: 404 })

    try {
        await connectDB();
        await order.deleteOne({ _id: id })

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}

export async function PATCH (req: NextRequest) {
    const { id, status, section, data } = await req.json();

    if (!id || !status || !section ||!data) return NextResponse.json({ message: 'no data provided' }, { status: 400 })
    
    try {
        await connectDB();

        const orders = await order.findOne({ _id: id });
        if (!orders) return NextResponse.json({ message: 'order not found' }, { status: 404 });
    
        const updates: Record<string, any> = {};
        updates.status = status;
    
        if (section === 'shipping') {
            for (const [key, value] of Object.entries(data)) {
                updates[`shipping.${key}`] = value;
            }
        }
    
        if (section === 'delivery') {
            for (const [key, value] of Object.entries(data)) {
                updates[`delivery.${key}`] = value;
            }
        }

        if (!Object.keys(updates).length) return NextResponse.json(
            { message: 'invalid update section' },
            { status: 400 }
        )
    
        await order.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        )

        return NextResponse.json(null, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}
