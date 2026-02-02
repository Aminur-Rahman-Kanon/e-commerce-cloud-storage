import React from "react"

type Props = {
    isOpen: boolean,
    children: React.ReactNode
}

export default function Modal ({ isOpen, children }: Props) {

    if (!isOpen) return;

    return (
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] p-5 
                        flex justify-center items-center bg-white shadow-lg z-10'>
            {children}
        </div>
    )
}
