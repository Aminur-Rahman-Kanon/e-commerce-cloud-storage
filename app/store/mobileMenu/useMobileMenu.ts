import { create } from 'zustand';

type MobileUiType = {
    isMobileMenuOpen: boolean,
    isCategoryMenuOpen: boolean,
    openMobileMenu: () => void,
    closeMobileMenu: () => void,
    openCategoryMenu: () => void,
    closeCategoryMenu: () => void,
}

export const useMobileMenu = create<MobileUiType>(set => ({
    isMobileMenuOpen: false,
    openMobileMenu: () => set({ isMobileMenuOpen: true }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false, isCategoryMenuOpen: false }),
    isCategoryMenuOpen: false,
    openCategoryMenu: () => set({ isCategoryMenuOpen: true }),
    closeCategoryMenu: () => set({ isCategoryMenuOpen: false }),
}))
