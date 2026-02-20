import React from "react";
import UiShell from "./ui-shell";
import Footer from "./components/layout/footer/footer";
import Header from "./components/layout/header/header";

export default function ShopLayout({
    children
}: {
    children:React.ReactNode
}) {
    return (
        <>
            <Header />
            <UiShell>
                {children}
            </UiShell>
            <Footer />
        </>
    )
}