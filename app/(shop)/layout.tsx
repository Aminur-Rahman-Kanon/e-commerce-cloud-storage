import React from "react";
import Header from "./components/layout/header/header";
import Footer from "./components/layout/footer/footer";
import { BasketProvider } from "./context/basketProvider/basketProvider";
import MobileMenu from "./components/layout/mobileMenu/mobileMenu";

export default function ShopLayout({
    children
}: {
    children:React.ReactNode
}) {
    return (
        <>
            <BasketProvider>
                {/* <MobileMenu /> */}
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
            </BasketProvider>
        </>
    )
}