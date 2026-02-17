import React from "react";
import UiShell from "./ui-shell";
import Footer from "./components/layout/footer/footer";

export default function ShopLayout({
    children
}: {
    children:React.ReactNode
}) {
    return (
        <>
            <UiShell>
                {children}
            </UiShell>
            <Footer />
        </>
    )
}