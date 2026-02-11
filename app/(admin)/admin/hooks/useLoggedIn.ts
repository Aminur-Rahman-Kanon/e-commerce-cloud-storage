'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

export type UserType = {
    name: string,
    role: string
}

export default function useLoggedIn () {
    const [user, setUser] = useState<UserType | {}>({});
    const params = useParams();
    const searchParams = useSearchParams();

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
    }, [params, searchParams]);


    return user as UserType;
}