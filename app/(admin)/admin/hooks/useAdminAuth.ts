'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export function useAdminAuth() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token){
            return router.push('/admin/login');
        }

        try {
            const decode = jwtDecode<{ role: string }>(token);

            if (decode.role !== 'admin'){
                return router.push('/');
            }
        } catch (error) {
            return router.push('/admin/login');
        }
    }, [router])
}
