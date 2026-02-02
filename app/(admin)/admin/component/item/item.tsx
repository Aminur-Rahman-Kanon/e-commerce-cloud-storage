import React, { useEffect, useState } from "react";
import { ItemType } from "../../type/items"
import ImageUpload from "../imageUpload/imageUpload";
import { toBoolean } from '@/app/(admin)/admin/utilities/utilities';
import { toast } from "react-toastify";
import _ from 'lodash';
import Modal from "@/app/(shop)/components/layout/modal/modal";

const containerClassName = 'w-full my-3 flex flex-col justify-center items-left space-y-3';
const labelClassName = 'w-180px capitalize font-medium';
const inputClassName = 'w-full h-[30px] border border-gray-500 mt-2 p-2 disabled:bg-gray-100 disabled:opacity-50';
const textareaClassName = 'w-full border border-gray-500 mt-2 p-2'
const selectClassName = 'w-full h-[30px] border border-gray-500 mt-2 pl-2'

export default function Item ({ item, index }: {item: ItemType, index: number}) {
    const [product, setProduct] = useState<ItemType | null>(null);
    const [copiedProduct, setCopiedProduct] = useState<ItemType | null>(null);
    const [rawImg, setRawImg] = useState<Blob[]>([]);
    const [preview, setPreview] = useState<string[]>([]);
    const [submitBtnDisable, setSubmitBtnDisable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isResponseMsg, setIsResponseMsg] = useState<boolean>(false)

    useEffect(() => {
        if (item){
            setProduct(item);
            setCopiedProduct(item);
            if (item?.image?.length){
                (async () => {
                    const rawImgs = await Promise.all(
                        item.image.map(async img => {
                            const res = await fetch(img.url);
                            return await res.blob();
                        })
                    )
                    setRawImg(rawImgs);
                })()
            }
        }
    }, [item]);
    console.log(rawImg);


    useEffect(() => {
        const imgUrl = rawImg.map(img => URL.createObjectURL(img));
        setPreview(imgUrl);
    }, [rawImg]);

    const imgUploadHandler = (e:React.ChangeEvent<HTMLInputElement>, imgIdx:number) => {
        e.preventDefault();
        const img:File | undefined = e.target.files?.[0];
        if (!img) return;

        try {
            const images = [...rawImg];
            images[imgIdx] = img;
            setRawImg(images);
        } catch (error) {
            throw new Error(error as string)
        }
    }

    const inputHandler = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'isActive' || name === 'isSpecial' || name === 'isNew' || name === 'isSale'){
            const boolVal = toBoolean(value);
            setCopiedProduct(prev => prev ? {
                ...prev,
                [name]: boolVal
            }: prev)
            return;
        }
        else {
            setCopiedProduct(prev => prev ? {
                ...prev,
                [name]: value
            }: prev)
        }
    }

    async function imgRemoveHandler (e:React.MouseEvent<HTMLButtonElement>, imgIdx:number)  {
        e.preventDefault();

        if (!imgIdx === undefined) return;
        
        try {
            const images = [...rawImg];

            if (images.length){
                images.splice(imgIdx, 1);
                setRawImg(images);
            }
        } catch (error) {
            throw new Error('operation failed')
        }
    }

    const addNewImg = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPreview(prev => prev ? [
            ...prev,
            ''
        ]:prev)
    }

    async function submitHandler (e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        
        if (!copiedProduct || !item) return;
        const formData = new FormData();
        
        try {
            formData.append('data', JSON.stringify(copiedProduct));
    
            if (rawImg.length) {
                rawImg.forEach(img => formData.append('imgs', img));
            }

            const updatedProduct:ItemType = await fetch('/api/admin/products/items', {
                method: 'PUT',
                body: formData
            }).then(res => res.json())
            .catch(err => new Error(err));

            if (typeof updatedProduct === 'object' && Object.keys(updatedProduct).length){
                setProduct(updatedProduct);
                setCopiedProduct(updatedProduct);
            }

            return toast.success(`${updatedProduct.name} updated!`)
            
        } catch (error) {
            throw new Error('failed to update item');
        }
    }

    const removeProductHandler = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await fetch('/api/admin/products/items', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: product?.id })
        })

        if (!res.ok) return toast.error(`failed to remove ${copiedProduct?.name.slice(0, 8)}`);

        setIsModalOpen(false);
        setIsResponseMsg(true);
        return toast.success(`${copiedProduct?.name.slice(0, 8)} removed!`);
    }

    const removeWarning = <div className="w-full flex flex-col justify-center items-center space-y-6">
        <h3 className="font-semibold">Are you sure want to remove {copiedProduct?.name.slice(0, 8)}</h3>
        <div>
            <button className="w-[150px] h-[40px] mx-2 bg-red-500 text-white hover:bg-red-700"
                    type="button"
                    onClick={() => setIsModalOpen(false)}>
                No
            </button>
            <button className="w-[150px] h-[40px] mx-2 bg-green-500 text-white hover:bg-green-700"
                    type="button"
                    onClick={removeProductHandler}>
                Yes
            </button>
        </div>
    </div>

    const responseMsg = <div className="w-full flex flex-col justify-center items-center space-y-6">
        <h3 className="font-semibold">{copiedProduct?.name} deleted!</h3>
        <button className="w-[150px] h-[40px] mx-2 bg-gray-400 text-black hover:bg-gray-500 text-sm"
                type="button"
                onClick={() => window.location.reload()}>
            Ok
        </button>
    </div>

    if (!product) return;

    return (
        <>
            <Modal isOpen={isModalOpen}>
                { removeWarning }
            </Modal>
            <Modal isOpen={isResponseMsg}>
                { responseMsg }
            </Modal>
            <form className="w-full flex flex-col justify-center items-left p-6 border-b-[1px] border-gray-500 space-y-6">
                <h4 className="font-bold">{`${index+1}. ${item.name.toUpperCase()}`}</h4>
                <div className={containerClassName}>
                    <label htmlFor="id" className={labelClassName}>Id</label>
                    <input type="text"
                            value={item.id}
                            disabled
                            id="id"
                            className={inputClassName} />
                </div>
                <div className={containerClassName}>
                    <label htmlFor="name" className={labelClassName}>Name</label>
                    <input type="text"
                            defaultValue={item.name}
                            id="name"
                            name="name"
                            className={inputClassName}
                            disabled />
                </div>
                <div className={containerClassName}>
                    <label htmlFor="slug" className={labelClassName}>Slug</label>
                    <input type="text"
                            defaultValue={item.slug}
                            id="slug"
                            name="slug"
                            className={inputClassName}
                            disabled />
                </div>
                <div className={containerClassName}>
                    <label htmlFor="details" className={labelClassName}>Details</label>
                    <textarea defaultValue={item.details}
                            id="details"
                            name="details"
                            rows={3}
                            className={textareaClassName}
                            onChange={inputHandler} />
                </div>
                <div className={containerClassName}>
                    <label htmlFor="id" className={labelClassName}>Description</label>
                    <textarea defaultValue={item.description ?? ''}
                            id="description"
                            name="description"
                            rows={7}
                            className={textareaClassName}
                            onChange={inputHandler} />
                </div>
                <div className={containerClassName}>
                    <h3>Images</h3>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(50px,120px))] auto-rows-[minmax(50px,120px)] gap-2">
                        {
                            preview?.length ? preview.map((img, idx) =>
                                <ImageUpload key={idx}
                                            img={img}
                                            index={idx}
                                            uploadHandler={imgUploadHandler}
                                            removeImgHandler={imgRemoveHandler} />)
                                :
                                null
                        }
                    </div>
                    <button className="w-[200px] h-[40px] border border-gray-600 bg-gray-600 text-white"
                            onClick={addNewImg} >
                        Add Image
                    </button>
                </div>
                {/*sizes */}
                <div className={containerClassName}>
                    <label htmlFor="isActive" className={labelClassName}>Active</label>
                    <select className={selectClassName}
                            id="isActive"
                            name="isActive"
                            defaultValue={item.isActive + ''}
                            onChange={inputHandler}>
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>
                <div className={containerClassName}>
                    <label htmlFor="isSpecial" className={labelClassName}>Special</label>
                    <select className={selectClassName}
                            id="isSpecial"
                            name="isSpecial"
                            defaultValue={item.isSpecial + ''}
                            onChange={inputHandler}>
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>

                <div className={containerClassName}>
                    <label htmlFor="isNew" className={labelClassName}>New Item</label>
                    <select className={selectClassName}
                            id="isNew"
                            name="isNew"
                            defaultValue={item.isNew + ''}
                            onChange={inputHandler}>
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>

                <div className={containerClassName}>
                    <label htmlFor="isSale" className={labelClassName}>On Sale ?</label>
                    <select className={selectClassName}
                            id="isSale"
                            name="isSale"
                            defaultValue={item.isSale + ''}
                            onChange={inputHandler}>
                        <option disabled>Please Select</option>
                        <option value={'true'}>True</option>
                        <option value={'false'}>False</option>
                    </select>
                </div>

                <div className="w-full py-3 flex justify-between items-center">
                    <button className="w-[200px] h-[40px] bg-red-500 text-white hover:bg-red-700"
                            type="button"
                            onClick={() => setIsModalOpen(true)}>
                        Remove Item
                    </button>
                    <button className="w-[200px] h-[40px] bg-green-500 text-white
                                        disabled:bg-green-300 disabled:cursor-not-allowed"
                            // disabled={submitBtnDisable}
                            type="submit"
                            onClick={submitHandler}>
                        Submit
                    </button>
                </div>
            </form>
        </>
    )
}
