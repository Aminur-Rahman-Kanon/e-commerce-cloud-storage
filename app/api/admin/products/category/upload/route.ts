import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import suparbaseServer from '@/lib/superbaseServer';
import { sanitizeDirName } from '../../../utilities/utilities';

type DataObject = {
    name: string,
    slug: string,
    description: string,
    image?: string
    isActive: boolean
}

export const runtime = 'nodejs';

export async function POST (req:Request) {
    try {
        const formData = await req.formData();
        const data = formData.get('data') as string;
        const file = formData.get('img') as File;
        const parsedData: DataObject = JSON.parse(data);
        parsedData.image = ''
        parsedData.name = sanitizeDirName(parsedData.name);
        
        if (!parsedData) return NextResponse.json({ error: 'no data provided' }, { status: 400 });

        const isItemExist = await prisma.category.findUnique({
            where: {
                name: parsedData.name
            }
        })

        if (isItemExist) return NextResponse.json({ error: 'item already exits' }, { status: 401 });
        
        if (file && file.type.startsWith('image/')){
            const arrayBuffer = await file.arrayBuffer();
            const ext = file.type.split('/').at(-1);
            const fileName = `${uuidv4()}.${ext}`;
            const filePath = `categories/${parsedData.name.trim().toLowerCase()}/${fileName}`
            const { data, error } = await suparbaseServer.storage.from('images').upload(filePath, new Uint8Array(arrayBuffer), {
                contentType: file.type
            });

            
            if (error) {
                console.log(error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            const url = await suparbaseServer.storage.from('images').getPublicUrl(filePath)
            if (!url.data) return NextResponse.json({ error: 'server error' }, { status: 500 })
            
            parsedData.image = url.data.publicUrl ?? null
        }

        await prisma.category.create({
            data: {
                ...parsedData
            }
        })

        return NextResponse.json( { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}
