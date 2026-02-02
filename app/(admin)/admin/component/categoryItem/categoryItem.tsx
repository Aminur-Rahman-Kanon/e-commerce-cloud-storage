'use client';

import { CategoriesType } from '@/app/(admin)/admin/type/categories';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { toBoolean } from '@/app/(admin)/admin/utilities/utilities';
import Image from 'next/image';
import { X } from 'lucide-react'

const inputClassName = 'block w-[200px] flex-none p-2 border border-gray-300';

export default function CategoryItem({ category, index }: { category: CategoriesType, index:number }) {

    const [item, setItem] = useState<CategoriesType | null>(null);
    const [copiedItem, setCopiedItem] = useState<CategoriesType | null>(null);
    const [img, setImg] = useState<File | null>(null);

    const [submitBtnDisable, setSubmitBtnDisable] = useState<boolean>(true);

    useEffect(() => {
        if (category){
            setItem(category);
            setCopiedItem(category);
        }
    }, [category]);

    if (!category) return;

    function onChangeHandler (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        e.preventDefault();
        e.stopPropagation()

        const { name, value } = e.target;

        if (name === 'isActive'){
            const boolValue = toBoolean(value);
            
            setCopiedItem(prev => prev ? {
                ...prev,
                [name]: boolValue
            }: prev)
        }
        else {
            setCopiedItem(prev => prev ? {
                ...prev,
                [name]: value
            } : prev)
        }
    }

    useEffect(() => {
        setSubmitBtnDisable(_.isEqual(item, copiedItem));
    }, [copiedItem, item])

    function imgUploadHanlder (e:React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        e.stopPropagation();
        const file = e.target.files?.[0];

        if (!file) return;

        //validation

        setImg(file)
        const objectUrl = URL.createObjectURL(file);
        setCopiedItem(prev => prev ? {
            ...prev,
            image: objectUrl
        }: prev)
    }

    async function submitHandler (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();

        formData.append('data', JSON.stringify(copiedItem));
        if (img){
            formData.append('img', img);
        }
        
        try {
            const res = await fetch('/api/admin/products/category', {
                method: 'PUT',
                body: formData
            })

            if (!res.ok) return toast.error(`${copiedItem?.name} failed to update`)
            
            toast.success(`${copiedItem?.name} updated!`)
            return setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error(error);
        }
    }

    const removeCategoryHandler = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const res = await fetch('/api/admin/products/category', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: category.id })
        })

        if (!res.ok) return toast.error(`Failed to delete ${category.name}`);

        toast.success('Successfully deleted');

        return setTimeout(() => {
            window.location.reload();
        }, 3000)
    }

    const removeImgHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setImg(null);
        setCopiedItem(prev => prev ? {
            ...prev,
            image: ''
        }: prev)
    }

    const imgSrc = copiedItem?.image ? copiedItem.image : '/images/icons/placeholder.png';

    return (
        <form className='w-full my-8 flex justify-center items-center'
              onSubmit={submitHandler}>
            <input type='text'
                    name='id'
                    disabled
                    defaultValue={category.id}
                    className={inputClassName} />

            <input type='text'
                    name='name'
                    defaultValue={category.name}
                    disabled
                    className={inputClassName} />

            <input type='text'
                    name='slug'
                    defaultValue={category.slug}
                    disabled
                    className={inputClassName} />
            
            <input type='text'
                    name='description'
                    defaultValue={category.description}
                    onChange={onChangeHandler}
                    className={inputClassName} />
            
            <div className='w-[200px] h-[100px] p-5 flex justify-center items-center'>
                <label className='relative w-full flex flex-col justify-center items-center overflow-hidden'
                        htmlFor={`input-el-${index}`} >
                    <Image src={imgSrc}
                            alt='placeholder'
                            width={50}
                            height={50}
                            style={{ objectFit:'cover' }} />
                    <p className='text-sm text-center mt-5'>Tap to add Image</p>
                    <button className='absolute top-[-1px] right-[-1px] w-[20px] h-[20px]'
                            type='button'
                            onClick={removeImgHandler}>
                        <X size={16} color='gray' />
                    </button>
                </label>
                <input type='file'
                        id={`input-el-${index}`}
                        onChange={imgUploadHanlder}
                        style={{ display:'none' }}
                        className='hidden w-full' />
            </div>
            
            <select defaultValue={category.isActive+'' || 'Please Select'}
                    name='isActive'
                    className={inputClassName}
                    onChange={onChangeHandler} >
                <option disabled>Please Select</option>
                <option value={'true'}>True</option>
                <option value={'false'}>False</option>
            </select>

            <div>
                <button className='w-[100px] h-[40px] bg-red-500 text-white hover:bg-red-700'
                        type='button'
                        onClick={removeCategoryHandler}>
                    Remove
                </button>
            </div>
            <button className='w-[100px] h-[40px] border border-green-500 bg-green-500 text-white
                                disabled:opacity-50 disabled:cursor-not-allowed'
                    type='submit'
                    disabled={submitBtnDisable} >
                Submit
            </button>
        </form>
    )
}