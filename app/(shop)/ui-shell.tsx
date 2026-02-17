'use client'

import Header from "./components/layout/header/header"
import MobileMenu from "./components/layout/mobileMenu/mobileMenu"
import { ToastContainer } from "react-toastify"

export default function UiShell ({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <MobileMenu />
            <ToastContainer />
            { children }
        </>
    )
}
