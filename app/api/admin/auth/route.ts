import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

const SECRET = process.env.JWT_SECRET!;

export async function POST(req:NextRequest){
    const { email, password } = await req.json();

    try {
        const queryUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!queryUser) return NextResponse.json(
            { status: 404, message: 'user not found' }
        )
        console.log(queryUser)
    
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

        return NextResponse.json({ token,
            name: queryUser.name,
            email: queryUser.email,
            role: queryUser.role
         })
    } catch (error) {
        return NextResponse.json({ error: 'invalid credentials' }, { status: 401 })
    }
}
