import { NextRequest, NextResponse } from 'next/server';
import { ItemType } from '@/app/(admin)/admin/type/items';
import { sanitizeStorageKey } from '@/app/api/admin/utilities/utilities';
import { v4 as uuid } from 'uuid';
import suparbaseServer from '@/lib/superbaseServer';
import { connectDB } from '@/lib/mongodb';
import { Item } from '@/app/model/items';

export const runtime = 'nodejs';

export async function GET (req: Request) {
    try {
        await connectDB();
        
        const items = await Item.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ items }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({ error: 'failed to fetch data' },
            { status: 404 }
        )
    }
}

export async function POST (req: Request) {
    const formData = await req.formData();
    const stringyData = formData.get('data') as string
    const imgs = formData.getAll('imgs') as File[];

    if (!stringyData) return NextResponse.json({ error: 'no data provided' }, { status: 400 });

    try {
        const data:ItemType = JSON.parse(stringyData);
    
        if (!data) return NextResponse.json({ error: 'invalid data' }, { status: 400 });
        
        const sanitizeItemName = sanitizeStorageKey(data.name);
        const sanitizeSlugName = sanitizeStorageKey(data.slug);
        data.name = sanitizeItemName;
        data.slug = sanitizeSlugName;
    
        const imgsUrl: string[] = await Promise.all(
            imgs.map(async (img, idx) => {
                const mime = img.type || 'image/png';
                const ext = mime.split('/').at(-1);
                const fileName = `${uuid()}.${ext}`;
                const filePath = `items/${sanitizeItemName}/${fileName}`;
                const arrayBuffer = await img.arrayBuffer();
                

                const { error: uploadError } =
                    await suparbaseServer.storage
                        .from(process.env.SUPERBASE_BUCKET_NAME!)
                        .upload(filePath, new Uint8Array(arrayBuffer), {
                            contentType: mime,
                    });

                    if (uploadError) {
                        throw new Error(uploadError.message);
                    }

                const { data: url } =
                    suparbaseServer.storage
                        .from(process.env.SUPERBASE_BUCKET_NAME!)
                        .getPublicUrl(filePath);

                    if (!url) {
                        throw new Error('url generate failed');
                    }

                return url.publicUrl;
            })
        );

        data.image = imgsUrl;
    
        await Item.create({ ...data }).then(res => res).catch(err => console.log(err))
        
        return NextResponse.json({ message: 'success' }, { status: 200 })
    } catch (error) {
        return NextResponse.json( error, { status: 500 })
    }
}

export async function PUT (req: Request) {
    const formData = await req.formData();
    const stringyData = formData.get('data') as string;
    const imgs = formData.getAll('imgs') as File[];
    
    if (!stringyData) return NextResponse.json({ error: 'no data provided' }, { status: 400 });
    
    try {
        await connectDB();

        const data:ItemType = JSON.parse(stringyData);
        
        const item = await Item.findOne({ _id: data._id });
        
        if (!item) return NextResponse.json({ error: 'item not found' }, { status: 404 });
        
        const bucketDir = `items/${data.name}`;
        
        const { data:imgList, error:imageListError } = 
            await suparbaseServer
                 .storage
                 .from(process.env.SUPERBASE_BUCKET_NAME!)
                 .list(bucketDir);
        
        if (imageListError) return NextResponse.json(imageListError, { status: 500 });

        const imgsToRemove = imgList.map(img => `${bucketDir}/${img.name}`);
        
        const { error:imgDeletionError } = 
            await suparbaseServer
                 .storage
                 .from(process.env.SUPERBASE_BUCKET_NAME!)
                 .remove(imgsToRemove);
        
        if (imgDeletionError) return NextResponse.json(imgDeletionError, { status: 500 });
        
        const imgsUrl:string[] = await Promise.all(
            imgs.map(async (img, idx) => {
                const arrayBuffer = await img.arrayBuffer();
                const mime = img.type || 'image/png';
                const ext = mime.split('/').at(-1);
                const fileName = `${uuid()}.${ext}`;
                const filePath = `${bucketDir}/${fileName}`;

                const { data:imgData, error:imgUploadError } = await suparbaseServer
                    .storage
                    .from(process.env.SUPERBASE_BUCKET_NAME!)
                    .upload(filePath, new Uint8Array(arrayBuffer), {
                        contentType: mime
                    })

                if (imgUploadError) throw new Error(imgUploadError.message);

                const { data:url} = suparbaseServer
                    .storage
                    .from(process.env.SUPERBASE_BUCKET_NAME!)
                    .getPublicUrl(filePath);
                
                if (!url) throw new Error('url generation failed');

                return url.publicUrl;
            }
        ));

        data.image = imgsUrl;

        const updatedData = await Item.findOneAndUpdate(
            { _id: data._id },
            { ...data },
            { new: true }
        )

        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 404 })
    }
}

export async function DELETE (req: NextRequest) {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: 'invalid operation' }, { status: 400 });

    try {
        await connectDB();

        const isItemExist = await Item.findOne({ _id: id });
    
        if (!isItemExist) return NextResponse.json({ error: 'item not exist' }, { status: 404 });

        const bucketDir = `items/${isItemExist.name}`;

        const { data:imgList, error: imgListingError } = await suparbaseServer
            .storage
            .from(process.env.SUPERBASE_BUCKET_NAME!)
            .list(bucketDir);

        if (imgListingError) return NextResponse.json( imgListingError, { status: 500 } );

        const imgsToDelete = imgList.map(img => `${bucketDir}/${img.name}`);

        const { error } = await suparbaseServer
            .storage.from(process.env.SUPERBASE_BUCKET_NAME!)
            .remove(imgsToDelete)

        if (error) return NextResponse.json({ error }, { status: 500 });

        await Item.deleteOne({ _id: id });
        
        return NextResponse.json({ message: 'success' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 })
        
    }
}
