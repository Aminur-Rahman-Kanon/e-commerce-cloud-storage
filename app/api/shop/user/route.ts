import { NextRequest, NextResponse } from "next/server";
import order from "@/app/model/order";
import { connectDB } from "@/lib/mongodb";

export async function POST (req:NextRequest) {
    const { user } = await req.json();

    if (!user) return NextResponse.json({ message: 'invalid request' }, { status: 405 });

    try {
        await connectDB();

        const isUserExist = await order.findOne({
            $or: [
                { 'user.email': user },
                { 'user.phone': user },
            ]
        })

        const res = {
            message: 'not found',
            id: ''
        }

        if (isUserExist) {
            res.message = 'found',
            res.id = isUserExist._id
        }
    
        return NextResponse.json(res, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
