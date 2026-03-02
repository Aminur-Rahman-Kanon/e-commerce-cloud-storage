'use client'

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useMobileMenu } from '@/app/store/mobileMenu/useMobileMenu';

export default function UiShell ({ children }: { children: React.ReactNode }) {

    const { updateNavbarCategory, navbarCategory } = useMobileMenu();

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/shop/items');
            if (!res.ok) return;

            const categories = await res.json();
            updateNavbarCategory(categories);
        })()
    }, []);

    return (
        <>
            <ToastContainer />
            { children }
        </>
    )
}
