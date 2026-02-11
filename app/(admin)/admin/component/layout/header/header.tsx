'use client';

import Image from "next/image";
import useLoggedIn from "../../../hooks/useLoggedIn";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Header() {

    const router = useRouter();

    const user = useLoggedIn();

    if (user?.role !== 'admin') return;

    async function logOutHandler () {
        const res = await fetch('/api/admin/auth', {
            method: 'DELETE',
            credentials: 'include'
        })

        if (!res.ok) return toast.error('Failed to log out');

        return router.push('/admin/login');
    }
    
    return (
        <div className="w-full h-[80px] flex justify-between items-center bg-white mb-10 p-5">
            <span className="font-medium">Welcome back 👋</span>
            <div className="flex flex-col items-center gap-1">
                <div className="relative w-10 h-10 rounded-full flex justify-center align-items">
                <Image src={'/images/icons/admin.png'}
                        alt="admin"
                        fill />
                </div>
                <div className="flex justify-center align-items space-x-2">
                <span className="flex justify-center items-center text-sm font-normal">{user?.role?.toUpperCase()}</span>
                <button className="w-[80px] h-[25px] border border-gray-400 bg-gray-400 text-black cursor-pointer"
                        onClick={logOutHandler}>
                    Logout
                </button>
                </div>
            </div>
        </div>
    );
    }
