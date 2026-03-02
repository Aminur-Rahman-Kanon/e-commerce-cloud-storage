import { create } from 'zustand';

type NavbarCategory = {
    _id: string,
    name: string
}

type MobileUiType = {
    isMobileMenuOpen: boolean,
    isCategoryMenuOpen: boolean,
    navbarCategory: NavbarCategory[] | [],
    openMobileMenu: () => void,
    closeMobileMenu: () => void,
    openCategoryMenu: () => void,
    closeCategoryMenu: () => void,
    updateNavbarCategory: (categories: NavbarCategory[]) => void
}

export const useMobileMenu = create<MobileUiType>(set => ({
    isMobileMenuOpen: false,
    isCategoryMenuOpen: false,
    navbarCategory: [],
    openMobileMenu: () => set({ isMobileMenuOpen: true }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false, isCategoryMenuOpen: false }),
    openCategoryMenu: () => set({ isCategoryMenuOpen: true }),
    closeCategoryMenu: () => set({ isCategoryMenuOpen: false }),
    updateNavbarCategory: (categories) => set({ navbarCategory: categories })
}))
