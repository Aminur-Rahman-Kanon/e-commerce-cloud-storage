'use client'

import MobileMenu from "./components/layout/header/mobileMenu/mobileMenu"
import { ToastContainer } from "react-toastify"

export default function UiShell ({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* <MobileMenu /> */}
            <ToastContainer />
            { children }
        </>
    )
}
