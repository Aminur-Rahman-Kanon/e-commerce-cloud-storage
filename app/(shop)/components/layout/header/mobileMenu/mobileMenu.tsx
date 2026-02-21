'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { X, ChevronLeft } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagramSquare, faTiktok, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';
import { useMobileMenu } from '@/app/store/mobileMenu/useMobileMenu';
import Image from 'next/image';
import { CategoriesType } from '@/app/(admin)/admin/type/categories';

type Props = {
    categories: CategoriesType[]
}

export default function MobileMenu({ categories }: Props) {
  const router = useRouter();
  const {
    isMobileMenuOpen,
    isCategoryMenuOpen,
    closeMobileMenu,
    openCategoryMenu,
    closeCategoryMenu
  } = useMobileMenu();

  const toggleMenuView = isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full';
  const toggleCategoryView = isCategoryMenuOpen ? 'translate-x-0' : '-translate-x-full';

  function routeAndMobileMenuHandler (path:string):void {
    if (!path) return;

    closeMobileMenu();
    router.push(path);
  }
  

  return (
    <header className={`fixed top-0 left-0 z-40 transition transform duration-400 w-full max-w-[500px] h-screen bg-white border border-gray-200 
                        ${toggleMenuView}`}>
        <div className='w-full h-full flex flex-col justify-between items-start px-3 py-5 '>
            <div className="w-full h-full flex flex-col items-start justify-start gap-y-10">
                <div className='w-full flex justify-between items-center'>
                    <div className="relative w-[100px] aspect-[3/2] flex jistify-center items-center">
                        <Image src={'/images/logo/logo_1.png'}
                                alt='logo'
                                fill
                                sizes='100%'
                                className='object-cover' />
                    </div>

                    <button className='w-[50px] h-[50px] flex justify-center items-center text-gray-600'
                            onClick={closeMobileMenu}>
                        <X size={20} />
                    </button>
                </div>

                <div className='relative w-full h-[fit-content] min-h-[250px] flex flex-col justify-start items-start'>
                    <nav className="flex flex-col justify-start items-start gap-y-8 text-gray-600 mt-10">
                        <Link href="/"
                            className="hover:text-gray-900 text-lg"
                            onClick={() => routeAndMobileMenuHandler('/')}>
                            Home
                        </Link>
                        <div className="hover:text-gray-900  text-lg"
                             onClick={openCategoryMenu}>
                            Category
                        </div>
                        <Link href="/about-us"
                              className="hover:text-gray-900 text-lg"
                              onClick={() => routeAndMobileMenuHandler('/about-us')}>
                            About Us
                        </Link>
                    </nav>
                    <div className={`absolute top-0 left-0 w-full h-full transition transform duration-400 ${toggleCategoryView}
                                    flex flex-col justify-start items-start bg-white z-30 gap-y-5`}>
                        <button className='flex justify-center items-center text-sm text-gray-600'
                                onClick={closeCategoryMenu}>
                            <ChevronLeft size={20} />
                        </button>
                        <div className='flex flex-col justify-start items-start gap-y-5'>
                            {
                                categories?.length ? categories.map(cat => <Link key={cat._id}
                                                                                 href={`/categories/${cat.name}`}
                                                                                 className='text-lg text-gray-600 capitalize'>
                                                                            {cat.name}
                                                                            </Link>)
                                :
                                'No Items'
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full flex justify-between items-start mb-[50px]'>
                <Link href={'#'} className='text-2xl text-gray-600'>
                    <FontAwesomeIcon icon={faFacebookSquare} />
                </Link>
                <Link href={'#'} className='text-2xl text-gray-600'>
                    <FontAwesomeIcon icon={faInstagramSquare} />
                </Link>
                <Link href={'#'} className='text-2xl text-gray-600'>
                    <FontAwesomeIcon icon={faTiktok} />
                </Link>
                <Link href={'#'} className='text-2xl text-gray-600'>
                    <FontAwesomeIcon icon={faYoutubeSquare} />
                </Link>
            </div>
        </div>
    </header>
  )
}
