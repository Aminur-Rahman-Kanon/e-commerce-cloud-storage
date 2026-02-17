'use client';

import React, { useEffect, useState } from "react";
import { toBoolean, validateImage } from '@/app/(admin)/admin/utilities/utilities';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type DataType = {
    name: string,
    slug: string,
    description: string,
    isActive: boolean
}

type FileType = File

export default function Page () {
    const [data, setData] = useState<DataType>({
        name: '',
        slug: '',
        description: '',
        isActive: true
    });

    const [img, setImg] = useState<FileType | null>(null);
    const [btnDisable, setBtnDisable] = useState<boolean>(true);
    const [spinner, setSpinner] = useState<boolean>(false)

    useEffect(() => {
        const keys:(keyof DataType)[] = ['name', 'slug', 'description'];

        const isTrue = keys.every(itm => {
            if (data[itm]) {
                return true;
            }
            else {
                return false;
            }
        })

        if(isTrue) {
            setBtnDisable(false);
        }
        else {
            setBtnDisable(true);
        }
    }, [data])

    function onChangeHandler (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement >) {
        e.preventDefault();

        const { name, value } = e.target;
        if (name === 'isActive'){
            const boolValue = toBoolean(value);
            
            setData(prev => prev ? {
                ...prev,
                [name]: boolValue
            }: prev)
        }
        else {
            setData(prev => prev ? {
                ...prev,
                [name]: value
            }: prev)
        }
    }

    function imgUploadHandler (e:React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        const imgInputEl= document.getElementById('img') as HTMLInputElement;
    
        if (!file) return;
    
        const error = validateImage(file);

        if (error){
            alert(error);
            if (!imgInputEl) alert('Something went wrong. Please reload the browser!');
            imgInputEl.value = ''
            return;
        }

        setImg(file);
    }

    async function submitHandler (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setSpinner(true);
        setBtnDisable(true);

        if (!data.name || !data.slug || !data.description) return;

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        if (img){
            formData.append('img', img);
        }

        if (!Array.from(formData.entries()).length) throw new Error('data input error');

        try {
            const res = await fetch('/api/admin/products/category', {
                method: 'POST',
                body: formData
            })

            setSpinner(false);
            setBtnDisable(false);

            if (!res.ok) throw new Error("upload failed");
            toast.success(`${data.name} created!`);
            
            return setTimeout(() => {
                window.location.reload();
            }, 2700);
        }
        catch (error: unknown) {
            setSpinner(false);
            setBtnDisable(false);
            if (error instanceof Error) {
                // preserves original message and stack
                return toast.error(`${error.message}`);
            } else if (typeof error === 'string') {
                return toast.error(error)
            } else {
                return toast.error('Unexpected error occured');
            }
        }
    }

    return (
        <div className="w-full p-6 flex flex-col justify-center items-center space-y-6">
            <h1 className="text-xl font-bold">Add a new Category</h1>
            <form className="w-full max-w-[700px] m-auto flex flex-col justify-left items-center"
                    onSubmit={submitHandler}>
                <div className="w-full flex justify-left items-center mb-5">
                    <label className="w-[180px]">Category Name</label>
                    <input type="text"
                            name="name"
                            placeholder="Category Name"
                            className='w-[calc(100%-180px)] p-2 border border-gray-300'
                            onChange={onChangeHandler} />
                </div>

                <div className="w-full flex justify-left items-cente mb-5">
                    <label className="w-[180px]">Category Slug</label>
                    <input type="text"
                            name="slug"
                            placeholder="Category Slug"
                            className='w-[calc(100%-180px)] p-2 border border-gray-300'
                            onChange={onChangeHandler} />
                </div>

                <div className="w-full flex justify-left items-center mb-5">
                    <label className="w-[180px]">Category Description</label>
                    <input type="text"
                            name="description"
                            placeholder="Category Description"
                            className='w-[calc(100%-180px)] p-2 border border-gray-300'
                            onChange={onChangeHandler} />
                </div>

                <div className="w-full flex justify-left items-center mb-5">
                    <label className="w-[180px]">Category Image</label>
                    <input type="file"
                            id="img"
                            multiple={false}
                            className='w-[calc(100%-180px)] p-2 border border-gray-300'
                            onChange={imgUploadHandler} />
                </div>

                <div className="w-full flex justify-left items-center mb-5">
                    <label className="w-[180px]">Active</label>
                    <select defaultValue={'true'}
                            name="isActive"
                            className='w-[calc(100%-180px)] p-2 border border-gray-300'
                            onChange={onChangeHandler} >
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>
                <button type="submit"
                        disabled={btnDisable}
                        className="w-full h-[40px] mt-15 bg-green-500 text-white hover:bg-green-600
                                    disabled:bg-green-300 disabled:cursor-not-allowed" >
                    {
                        spinner ? <FontAwesomeIcon icon={faSpinner}
                                                    spinPulse
                                                    className="text-sm text-white"/>
                                :
                                'Submit'
                    }
                </button>
            </form>
        </div>
    )
}
