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
        const updatedData = await order.updateOne(
            { _id: id },
            { $set: {
                status
            }}
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
        await order.deleteOne({ _id: id })

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
