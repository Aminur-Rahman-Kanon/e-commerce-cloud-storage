import { connectDB } from "@/lib/mongodb";
import { Category } from "@/app/model/category";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectDB();
    
        const categories = await Category.find(
            { isActive: true },
            { name: 1, _id: 1 }
        ).lean();

        return NextResponse.json(categories, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
