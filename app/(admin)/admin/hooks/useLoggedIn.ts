'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export type UserType = {
    name: string,
    role: string
}

export default function useLoggedIn () {
    const [user, setUser] = useState<UserType | {}>({});

    const pathName = usePathname();

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/admin/me', {
                credentials: 'include'
            });

            if (!res.ok) {
                setUser({})
                return;
            }
            else {
                const usr:UserType = await res.json();
                setUser(usr)
            }
        })()
    }, [pathName]);


    return user as UserType;
}