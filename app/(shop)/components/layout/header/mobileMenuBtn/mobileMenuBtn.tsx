'use client';

import { useMobileMenu } from '@/app/store/mobileMenu/useMobileMenu';
import { Menu } from 'lucide-react';

export default function MobileMenuBtn () {

    const { openMobileMenu } = useMobileMenu();

    return (
        <button className="w-[30px] h-[30px] text-sm text-gray-600 flex justify-center items-center
                            md:hidden"
                onClick={openMobileMenu}>
            <Menu />
        </button>
    )
}
