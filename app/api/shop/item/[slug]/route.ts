import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    
    try {
        const product = await prisma.item.findUnique({
            where: {
                id: slug
            },
            include: {
                image: true,
                prices: true
            }
        })
        
        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 404 })
    }
}
