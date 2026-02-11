import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'

export async function GET () {
    try {
        const category = await prisma.category.findMany({
            where: {
                isActive: true
            },
            include: {
                Items: {
                    where: {
                        isActive: true,
                    },
                    include: {
                        image: true,
                        prices: true
                    }
                }
            }
        })
    
        return NextResponse.json({ category }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'failed to fetch data' }, { status: 400 })
    }
}
