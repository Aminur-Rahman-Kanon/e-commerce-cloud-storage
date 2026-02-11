import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { adminModel } from '@/app/model/admin';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET!;

export async function POST(req:NextRequest){
    const { email, password } = await req.json();

    try {
        const queryUser = await adminModel.findOne({ email }).lean();
        if (!queryUser) return NextResponse.json(
            { status: 404, message: 'user not found' }
        )
    
        const hashedPass = await bcrypt.compare(password, queryUser.password);
        if (!hashedPass) return NextResponse.json({
            status: '403',
            message: 'invalid password'
        })

        if (queryUser.role !== 'admin') return NextResponse.json({
            status: '403',
            message: 'permission denied'
        })

        const token = jwt.sign({
            name: queryUser.name,
            email: queryUser.email,
            role: 'admin'
        }, SECRET, { expiresIn:  '2h'})

        const cookie = await cookies();

        cookie.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 2, // 2 hours
        });

        return NextResponse.json({ message: 'login successful' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 })
    }
}

export async function DELETE() {
    const cookie = await cookies();

    try {
        cookie.set('admin_token', "", {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        })
        return NextResponse.json({ message: 'Logged out' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'server error' }, { status: 500 })
    }
}
