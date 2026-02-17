'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Search, ShoppingBasket, UserRound, Menu } from 'lucide-react';
import Image from "next/image";
import { useBasketStore } from '@/app/store/basket/basket';
import { useMobileMenu } from '@/app/store/mobileMenu/useMobileMenu';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

export default function Header () {
    const router = useRouter();

    const { openMobileMenu } = useMobileMenu();

    const count = useBasketStore(state =>
        state.items.reduce((sum, i) => sum + i.quantity, 0)
    );

    const [userCredential, setUserCredential] = useState<string>('');
    const [userLoginBtnSpinner, setUserLoginBtnSpinner] = useState<boolean>(false);
    const [userLoginBtnDisable, setUserLoginBtnDisable] = useState(true);

    useEffect(() => {
        userCredential ? setUserLoginBtnDisable(false) : setUserLoginBtnDisable(true);
    }, [userCredential]);

    function useInputHandler (e:React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        const input = e.target.value.trim().toLowerCase();
        setUserCredential(input);
    }

    async function userLoginHandler (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setUserLoginBtnSpinner(true);
        setUserLoginBtnDisable(true);

        if (!userCredential) return;
        
        const userInput = userCredential.trim().toLowerCase();
        const inputEl = document.getElementById('user-input') as HTMLInputElement

        const res = await fetch('/api/shop/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: userInput })
        })

        setUserLoginBtnSpinner(false);
        setUserLoginBtnDisable(false);
        if (!res.ok) return toast.error('Login failed');
        
        const { message, id } = await res.json();

        if (message === 'not found') return toast.warning('User not found')
        
        inputEl.value = '';
        router.push(`/user/${id}`);
    }

    return (
        <div className="w-full p-2 grid grid-cols-[repeat(3,100px)] justify-between items-center overflow-hidden 
                        md:grid-cols-[repeat(3,150px)] 
                        lg:grid-cols-[repeat(3,250px)]">
            <button className="w-[30px] h-[30px] text-sm text-gray-600 flex justify-center items-center
                                md:hidden"
                    onClick={openMobileMenu}>
                <Menu />
            </button>
            <nav className="w-full hidden flex justify-left items-center
                            md:flex">
                <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600 text-center
                                            hover:text-black transition-colors duration-300 ease-out">
                    Home
                </Link>
                <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600
                                            hover:text-black transition-colors duration-300 ease-out">
                    Category
                </Link>
                <Link href={'/'} className="w-[80px] mx-3 shrink-0 text-md font-normal text-gray-600
                                            hover:text-black transition-colors duration-300 ease-ou">
                    About Us
                </Link>
            </nav>

            <div className="relative w-full h-[100px] aspect=[3/2] flex justify-center items-center">
                <Image src={'/images/logo/logo_1.png'}
                        alt="antorbon"
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }} />
            </div>

            <div className="relative w-full flex justify-end items-center px-2">
                <div className="w-[35px] h-[35px] flex justify-center items-center hover:cursor-pointer">
                    <Search size={20} color="gray" />
                </div>
                <div className="group w-[35px] h-[35px] flex justify-center items-center hover:cursor-pointer">
                    <UserRound size={20} color="gray" />
                    <form className="absolute top-full right-0 z-10 width-full p-3 bg-white border border-gray-500 rounded
                                    hidden flex-col justify-center items-start gap-y-3 group-hover:flex"
                                    onSubmit={userLoginHandler} >
                        <h3 className="text-xs text-gray-600">Want to check your orders?</h3>
                        <input type="text"
                                id="user-input"
                               className="relative w-full h-[40px] border border-gray-400 rounded pl-2 text-xs"
                               placeholder="Enter Your Phone or Email"
                               onChange={ useInputHandler } />

                        <button className="w-full h-[40px] bg-green-500 text-white rounded mt-2 text-xs
                                            disabled:bg-green-300 disabled:cursor-not-allowed"
                                disabled={userLoginBtnDisable}>
                            {
                                userLoginBtnSpinner ? <FontAwesomeIcon icon={faSpinner} spinPulse />
                                :
                                'Submit'
                            }
                        </button>
                    </form>
                </div>
                <Link href={'/basket'} className="relative block w-[35px] h-[35px] flex justify-center items-center">
                    <ShoppingBasket size={20} color="gray" />
                    <span className="absolute -top-3 -right-2 w-[25px] h-[25px] rounded-full z-10
                                    bg-[#012523] text-white text-xs -font-normal
                                    flex justify-center items-center">
                        {count}
                    </span>
                </Link>
            </div>

        </div>
    )
}
