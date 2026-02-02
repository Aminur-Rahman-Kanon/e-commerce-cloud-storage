'use client';
import { ImageType } from '@/app/(admin)/admin/type/items';

import Image from "next/image";
import React from 'react';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'

type Props = {
    img: string,
    index: number,
    uploadHandler: (e:React.ChangeEvent<HTMLInputElement>, imgIdx:number) => void,
    removeImgHandler: (e:React.MouseEvent<HTMLButtonElement>, imgId:number) => void
}

export default function ImageUpload ({ img, index, removeImgHandler, uploadHandler }: Props) {
    const uniqueId = uuidv4();
    
    return (
        <div className='w-full flex flex-col justify-cetner items-center rounded-lg'>
            <label htmlFor={`img-input-${uniqueId}`}
                    className="relative w-full h-full flex flex-col justify-center items-center relative">
                <div className='relative w-[50px] h-[50px] aspect-square mb-[10px]'>
                    <Image src={img ? img : '/images/icons/placeholder.png'}
                            alt="img-upload"
                            fill
                            style={{ objectFit:'cover' }} />
                </div>
                <p className='text-sm capitalize text-center'>Tap to add image</p>
                <button onClick={(e) => removeImgHandler(e, index)}
                        className='absolute top-[-8px] right-1 w-[20px] h-[20px] rounded-md color-gray-500
                                    hover:bg-gray-500 hover:text-white' >
                    <X size={20}
                        className='cursor-pointer' />
                </button>
            </label>
            <input type="file"
                    id={`img-input-${uniqueId}`}
                    accept=".jpg, .jpeg, .png, .webp"
                    className="w-full hidden"
                    onChange={(e) => uploadHandler(e, index)} />
        </div>
    )
}
