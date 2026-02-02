'use client';
import { NewItemType } from '@/app/(admin)/admin/type/items';
import React, { useEffect, useState } from 'react';
import ImageUpload from '../../component/imageUpload/imageUpload';
import { isFormValid } from '../../utilities/utilities';
import { toast } from 'react-toastify';
import { CategoriesType } from '../../type/categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const containerClass = 'w-full flex justify-left items-start';
const labelClass = 'w-[200px]';
const inputClass = 'w-full p-2 border border-gray-200';
const textareaClassName = 'w-full p-2 border border-gray-200'
const imgContainerClass = 'w-full h-[200px] flex flex-col justify-between items-left space-y-6';
const checkboxLabel = 'flex justify-center items-center gap-2 mr-2'
const innerBlock = 'w-1/2 max-w-[350px] flex justify-left items-center mr-5'

type Category = {
    id: string,
    name: string
}

export default function page () {
    const [item, setItem] = useState<NewItemType>({
        name: '',
        slug: '',
        details: '',
        categoryId: '',
        description: '',
        size: [],
        prices: {
            base: '',
            discounted: ''
        },
        isActive: true,
        isSpecial: false,
        isNew: true,
        isSale: false
    });

    const [rawImg, setRawImg] = useState<Blob[]>([]);
    const [preview, setPreview] = useState<string[]>([]);
    const [disableSubmitBtn, setDisableSubmitBtn] = useState<boolean>(true);

    const [category, setCategory] = useState<Category[]>([]);
    const [spinner, setSpinner] = useState<boolean>(false);
    
    const requiredFields: (keyof NewItemType)[] = ["name", "slug", "categoryId", "details", "description", "prices"];

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/admin/products/category');
            const data = await res.json();
            const cat:CategoriesType[] = data.categories
            const catego:Category[] = cat.map(itm => ({ id: itm.id, name: itm.name }));
            setCategory(catego)
        })()
    }, [])
    
    useEffect(() => {
        const isValid = isFormValid(requiredFields, item)
        
        if (isValid){
            setDisableSubmitBtn(false);
        }
        else {
            setDisableSubmitBtn(true);
        }
    }, [item, rawImg])

    const textInputHandler = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const {name, value} = e.target;

        setItem(prev => prev ? {
            ...prev,
            [name]: value
        }: prev)
    }

    const sizeInputHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;

        setItem(prev => prev ? {
            ...prev,
            size: prev.size ? checked ? [...prev.size, value] : prev.size?.filter(itm => itm !== value) : []
        }: prev)
    }

    const priceInputHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const prices = {
            ...item.prices,
            [name]: value
        }

        setItem(prev => prev ? {
            ...prev,
            prices: prices
        }: prev)
    }

    const selectInputHandler = (e:React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (name === 'isActive' || name === 'isSpecial' || name === 'isNew' || name ==='isSale'){
            setItem(prev => prev ? {
                ...prev,
                [name]: value === 'true' ? true : false
            }: prev)
        }
        else {
            setItem(prev => prev ? {
                ...prev,
                [name]: value
            }: prev)
        }
    }

    const addNewPreview = () => {
        setPreview(prev => prev ? [
            ...prev,
            ''
        ]: prev)
    }

    const addNewImageHandler = (e:React.ChangeEvent<HTMLInputElement>, imgIdx:number) => {
        e.preventDefault();
        const img = e.target.files?.[0];

        if (!img) return;

        const rawImgs = [ ...rawImg ];
        rawImgs[imgIdx] = img;

        const urlObject = URL.createObjectURL(img);
        const previews = [ ...preview ];
        previews[imgIdx] = urlObject;


        setRawImg(rawImgs);
        setPreview(previews);
    }

    const removeImgHandler = (e:React.MouseEvent<HTMLButtonElement>, imgIdx:number) => {
        e.preventDefault();
        const rawImgs = [ ...rawImg ];
        const previews = [ ...preview ];
        
        rawImgs.splice(imgIdx, 1);
        previews.splice(imgIdx, 1);

        setRawImg(rawImgs);
        setPreview(previews);
    }

    async function submitHandler (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setSpinner(true);
            setDisableSubmitBtn(true)
    
            const isValid = isFormValid(requiredFields, item);
            if (!isValid) return;
    
            const formData = new FormData();
            formData.append('data', JSON.stringify(item));
    
            rawImg.forEach(img => formData.append('imgs', img));
    
            const res = await fetch('/api/admin/products/items', {
                method: 'POST',
                body: formData
            })
    
            if (!res.ok) return toast.error(`${item.name.slice(0, 15)} failed to create`);
    
            toast.success(`${item.name.slice(0, 8)} created!`);
    
            return setTimeout(() => {
                window.location.reload();
            }, 2500);
        } catch (error) {
            setSpinner(false);
            setDisableSubmitBtn(false);
            return toast.error(error + '')
        }
    }

    return (
        <div className='w-full flex flex-col justify-center items-left space-6 p-7'>
            <h2 className='text-md font-bold'>Add New Item</h2>
            <form className="w-full flex flex-col justify-center items-left mt-6 space-y-6"
                onSubmit={submitHandler} >
                <div className={containerClass}>
                    <label htmlFor="name"
                            className={labelClass}>
                        Name
                    </label>
                    <input type="text"
                            id="name"
                            name="name"
                            className={inputClass}
                            onChange={textInputHandler} />
                </div>

                <div className={containerClass}>
                    <label htmlFor="slug"
                            className={labelClass}>
                        Slug
                    </label>
                    <input type="text"
                            id="slug"
                            name="slug"
                            className={inputClass}
                            onChange={textInputHandler} />
                </div>

                <div className={containerClass}>
                    <label htmlFor="categoryId"
                            className={labelClass}>
                        Category
                    </label>
                    <select className={inputClass}
                            id='categoryId'
                            name='categoryId'
                            defaultValue={'Please Select'}
                            onChange={selectInputHandler}>
                        <option disabled>Please Select</option>
                        {
                            category.map(cat => <option key={cat.id}
                                                        value={cat.id}
                                                        className='capitalize' >
                                {cat.name}
                            </option>)
                        }
                    </select>
                </div>

                <div className={containerClass}>
                    <label htmlFor="details"
                            className={labelClass}>
                        Details
                    </label>
                    <textarea id='details'
                            name='details'
                            rows={3}
                            className={textareaClassName}
                            onChange={textInputHandler} />
                </div>

                <div className={containerClass}>
                    <label htmlFor="description"
                            className={labelClass}>
                        Description
                    </label>
                    <textarea id='description'
                            name='description'
                            rows={7}
                            className={textareaClassName}
                            onChange={textInputHandler} />
                </div>

                <div className={imgContainerClass}>
                    <label>Images</label>
                    <div className="grid grid-cols-[repeat(auto-fit,_150px)] gap-4">
                        {
                            preview.map((img, idx) => <ImageUpload img={img}
                                                            key={idx}
                                                            index={idx}
                                                            uploadHandler={addNewImageHandler}
                                                            removeImgHandler={removeImgHandler} />)
                        }
                    </div>
                    <button className='w-[200px] h-[40px] bg-gray-300 text-black hover:bg-gray-400'
                            type='button'
                            onClick={addNewPreview}>
                        Add Image
                    </button>
                </div>

                <div className={containerClass}>
                    <label className={labelClass}>Sizes</label>
                    {
                        ['small', 'medium', 'large'].map(sz => <label key={sz} className={checkboxLabel}>
                            <input type='checkbox'
                                    value={sz}
                                    checked={item?.size?.includes(sz)}
                                    onChange={sizeInputHandler} />
                            {sz}
                        </label>)
                    }
                </div>

                <div className={containerClass}>
                    <legend className={labelClass}>
                        Prices
                    </legend>
                    <div className={innerBlock}>
                        <label className={labelClass}
                                htmlFor='base'>
                            Base Price:
                        </label>
                        <input type="number"
                                id="base"
                                name="base"
                                className={inputClass}
                                onChange={priceInputHandler} />

                    </div>
                    <div className={innerBlock}>
                        <label className={labelClass}
                                htmlFor='discounted'>
                            Discounted Price:
                        </label>
                        <input type="number"
                                id="discounted"
                                name="discounted"
                                className={inputClass}
                                onChange={priceInputHandler} />

                    </div>
                </div>

                <div className={containerClass}>
                    <label htmlFor="isActive"
                            className={labelClass}>
                        Active
                    </label>
                    <select className={inputClass}
                            id='isActive'
                            name='isActive'
                            defaultValue={'true'}
                            onChange={selectInputHandler} >
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>

                <div className={containerClass}>
                    <label htmlFor="isSpecial"
                            className={labelClass}>
                        Special
                    </label>
                    <select className={inputClass}
                            id='isSpecial'
                            name='isSpecial'
                            defaultValue={'false'}
                            onChange={selectInputHandler} >
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>

                <div className={containerClass}>
                    <label htmlFor="isNew"
                            className={labelClass}>
                        New Item ?
                    </label>
                    <select className={inputClass}
                            id='isNew'
                            name='isNew'
                            defaultValue={'true'}
                            onChange={selectInputHandler} >
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>

                <div className={containerClass}>
                    <label htmlFor="isSale"
                            className={labelClass}>
                        On Sale ?
                    </label>
                    <select className={inputClass}
                            id='isSale'
                            name='isSale'
                            defaultValue={'false'}
                            onChange={selectInputHandler} >
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>

                <button className='w-[300px] h-[40px] bg-green-400 text-white hover:bg-green-500
                                    disabled:bg-green-300 disabled:cursor-not-allowed'
                        type='submit'
                        disabled={disableSubmitBtn} >
                    {
                        spinner ? <FontAwesomeIcon icon={faSpinner}
                                                    spinPulse
                                                    className='text-md text-white'/>
                                    :
                                    'Submit'
                    }
                </button>
            </form>
        </div>
    )
}