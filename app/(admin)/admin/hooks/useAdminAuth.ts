'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/admin/me', {
                    credentials: 'include'
                })
    
                if (res.ok){
                    return router.push('/admin');
                }
            } catch (error) {
                return router.push('/admin/login');
            }
        })()
    }, [router])
}
