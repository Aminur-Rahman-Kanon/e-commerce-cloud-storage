import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ImageType, ItemType, NewItemType } from '@/app/(admin)/admin/type/items';
import fs from 'fs';
import path from 'path';
import { saveImgToDisk, sanitizeDirName, sanitizeStorageKey } from '@/app/api/admin/utilities/utilities';
import { v4 as uuid } from 'uuid';
import suparbaseServer from '@/lib/superbaseServer';

//fix replace image function
export const runtime = 'nodejs';

export async function GET (req: Request) {
    try {
        const items = await prisma.item.findMany({
            include: {
                image: true,
                prices: true
            }
        })
        return NextResponse.json({ items }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({ error: 'failed to fetch data' },
            { status: 404 }
        )
    }
}

export async function PUT (req: Request) {
    const formData = await req.formData();
    const stringyData = formData.get('data') as string;
    const imgs = formData.getAll('imgs') as File[];
    
    if (!stringyData) return NextResponse.json({ error: 'no data provided' }, { status: 400 });
    
    try {
        const data:ItemType = JSON.parse(stringyData);
        
        const item = await prisma.item.findUnique({
            where: {
                id: data.id
            },
            include: {
                category: true,
                image: true
            }
        });
        
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
        
        const imgsUrl:ImageType[] = await Promise.all(
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

                const urlObj = suparbaseServer
                    .storage
                    .from(process.env.SUPERBASE_BUCKET_NAME!)
                    .getPublicUrl(filePath);
                
                if (!urlObj.data) throw new Error('url generation failed');

                return {
                    filename: fileName,
                    url: urlObj.data.publicUrl,
                    order: idx
                }
            }
        ))

        const updatedData = await prisma.item.update({
            where: {
                id: item.id
            },
            data: {
                name: data.name,
                slug: data.slug,
                details: data.details,
                description: data.description,
                categoryId: data.categoryId,
                size: data.size ?? '',
                isActive: data.isActive,
                isSpecial: data.isSpecial,
                isNew: data.isNew,
                isSale: data.isSale,
                image: {
                    deleteMany: {},
                    create: imgsUrl
                },
                prices: data.prices ? {
                    upsert: {
                        create: {
                            base: data.prices.base,
                            discounted: data.prices.discounted
                        },
                        update: {
                            base: data.prices.base,
                            discounted: data.prices.discounted
                        }
                    }
                }
                : undefined
            },
            include: {
                prices: true,
                image: true
            }
        })

        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 404 })
    }
}

export async function DELETE (req: NextRequest) {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: 'invalid operation' }, { status: 400 });

    try {
        const isItemExist = await prisma.item.findUnique({
            where: {
                id: id
            }
        })
    
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

        await prisma.item.delete({
            where: {
                id: id
            }
        })
        
        return NextResponse.json({ message: 'success' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 })
        
    }
}

export async function POST (req: Request) {
    const formData = await req.formData();
    const stringyData = formData.get('data') as string
    const imgs = formData.getAll('imgs') as File[];

    if (!stringyData) return NextResponse.json({ error: 'no data provided' }, { status: 400 });

    try {
        const data = JSON.parse(stringyData);
    
        if (!data) return NextResponse.json({ error: 'invalid data' }, { status: 400 });

        const sanitizeItemName = sanitizeStorageKey(data.name);
        const sanitizeSlugName = sanitizeStorageKey(data.slug);
    
        const imgsUrl: ImageType[] = await Promise.all(
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
                        console.error(uploadError)
                    }

                const { data: url } =
                    suparbaseServer.storage
                        .from(process.env.SUPERBASE_BUCKET_NAME!)
                        .getPublicUrl(filePath);

                    if (!url) {
                        console.error('url generate error');
                        // throw new Error('url generate failed');
                    }

                return {
                    filename: fileName,
                    url: url.publicUrl,
                    order: idx,
                };
            })
        );
    
        await prisma.item.create({
            data: {
                name: sanitizeItemName,
                slug: sanitizeSlugName,
                details: data.details,
                description: data.description,
                category: {
                    connect: {
                        id: data.categoryId
                    }
                },
                size: data.size,
                isActive: data.isActive,
                isSpecial: data.isSpecial,
                isNew: data.isNew,
                isSale: data.isSale,
                image: {
                    create: imgsUrl
                },
                prices: data.prices ? {
                    create: {
                        base: data.prices.base,
                        discounted: data.prices.discounted
                    }
                }
                : undefined
            }
        })
    
        return NextResponse.json({ message: 'success' }, { status: 200 })
    } catch (error) {
        return NextResponse.json( error, { status: 401 })
    }
}
