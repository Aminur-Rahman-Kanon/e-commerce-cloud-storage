import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid'
import suparbaseServer from '@/lib/superbaseServer';
import { sanitizeStorageKey } from '../../utilities/utilities';

export const runtime = 'nodejs';

type DataObject = {
    name: string,
    slug: string,
    description: string,
    image?: string
    isActive: boolean
}

export async function GET () {
    try {
        const categories = await prisma.category.findMany();        
        return NextResponse.json({ categories });
    } catch (error) {
        return NextResponse.json(
            { error: 'failed to fetch data' },
            { status: 404 }
        )
    }
}


export async function POST (req:Request) {
    try {
        const formData = await req.formData();
        const data = formData.get('data') as string;
        const file = formData.get('img') as File;
        const parsedData: DataObject = JSON.parse(data);
        parsedData.image = ''
        parsedData.name = sanitizeStorageKey(parsedData.name);
        
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


export async function PUT (req: Request) {
    try {
        const formData = await req.formData()
        const stringyData = formData.get('data') as string
        const data = JSON.parse(stringyData);
        const img = formData.get('img') as File;
    
        if (!data) return NextResponse.json({ error: 'no data provided' }, { status: 400 });

        const item = await prisma.category.findUnique({
            where: {
                id: data.id
            }
        })

        if (!item) return NextResponse.json({ error: 'invalid request' }, { status: 400 });

        const categoryDir = `categories/${data.name}`;

        //if there is no image to upload then remove the image from superbase and sql table
        if (!data.image && !img) {
            const { data:existedImg, error } = await suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).list(categoryDir);
            
            if (error) return NextResponse.json({ error }, { status: 500 });
            
            if (existedImg.length){
                const paths = existedImg.map(pth => `${categoryDir}/${pth.name}`);
                const { error } = await suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).remove(paths);

                if (error) return NextResponse.json({ error }, { status: 500 });
                data.image = null;
            }
        }
    
        //if there is img to upload then find the previous image, delete and upload the new image
        if (img && img.type.startsWith('image/')){
            const ext = img.type.split('/').at(-1);
            const filename = `${uuidv4()}.${ext}`;
            const filePath = `${categoryDir}/${filename}`;
            const arrayBuffer = await img.arrayBuffer();

            //remove previous image
            const { data:existedImg, error:itemListingError } = await suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).list(categoryDir);
            
            if (itemListingError) return NextResponse.json({ itemListingError }, { status: 500 });
            
            if (existedImg.length){
                const paths = existedImg.map(pth => `${categoryDir}/${pth.name}`);
                const { error } = await suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).remove(paths);

                if (error) return NextResponse.json({ error }, { status: 500 })
            }

            const { data: imgData, error } = await suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).upload(filePath, new Uint8Array(arrayBuffer), {
                contentType: img.type
            });
            if (error) return NextResponse.json({ error }, { status: 500 });

            const urlObj = suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).getPublicUrl(filePath);

            data.image = urlObj.data.publicUrl ?? null
        }

        const updatedData = await prisma.category.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                image: data.image,
                isActive: data.isActive
            }
        })
    
        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
    }
}

export async function DELETE (req: Request) {
    const { id } = await req.json();

    try {
        const category = await prisma.category.findUnique({
            where: {
                id: id
            }
        })
    
        if (!category) return NextResponse.json({ error: 'not found' }, { status: 404 });
    
        const { data, error:imgListingError } = await suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).list(category.name);
        if (imgListingError) return NextResponse.json({ imgListingError }, { status: 500 });

        const imgsToDelete = data.map(img => `${category.name}/${img.name}`);
        const { error:imgDeleteError } = await suparbaseServer.storage.from(process.env.SUPERBASE_BUCKET_NAME!).remove(imgsToDelete);

        if (imgDeleteError) return NextResponse.json({ imgDeleteError }, { status: 400 })

        await prisma.category.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({ message: 'success' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}
