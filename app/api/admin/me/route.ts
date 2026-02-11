import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET () {
    try {
        const cookie = await cookies();
        const adminCookie = cookie.get('admin_token')?.value;
    
        if (!adminCookie) return NextResponse.json({ error: 'not found' }, { status: 500 })
    
        const decoded = jwt.verify(adminCookie, process.env.JWT_SECRET!) as {
            name: string,
            email: string,
            role: string
        };
        
        const data = {
            name: '',
            role: ''
        }
        if (decoded){
            data.name = decoded.name,
            data.role = decoded.role
        } 

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(null, { status: 404 });
    }
}
