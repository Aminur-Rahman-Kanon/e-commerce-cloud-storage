'use client';

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()])

  return (
    <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    <div className="embla__slide">
                        <div className='relative w-full h-full'>
                            <Image src={'/images/hero/bg_1.jpg'}
                                    alt='antorbon'
                                    fill
                                    style={{ objectFit: 'cover', filter: 'blur(7px)' }} />
                            {/*banner*/}
                            <div className='absolute top-0 left-0 w-full h-full'>
                                <div className='w-full h-full flex flex-col-reverse justify-center items-center md:flex-row'>
                                    <div className='md:w-1/2 p-5 flex justify-center items-center
                                                    w-full'>
                                        <div className='w-full flex flex-col justify-center items-center'>
                                            <h3 className='text-sm font-bold tracking-wide text-gray-500 my-2'>ANTORBON.COM</h3>
                                            <h2 className='text-4xl text-gray-500 text-center font-normal tracking-wide my-2'>
                                                OUR NEW PRODUCTS, INDOOR PLANTS
                                            </h2>
                                            <div className='w-full flex flex-col justify-center items-center my-6'>
                                                <h4 className='text-md text-gray-500 my-2 text-center font-semibold tracking-wide'>
                                                AVAILABLE OLNY ON THE WEBSITE
                                                </h4>
                                                <Link href={'/'} className='w-[200px] h-[40px] my-2 flex justify-center items-center 
                                                                            bg-white text-gray-500 font-bold border border-gray-500'>
                                                SHOP NOW
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    {/*image*/}
                                    <div className='w-1/2 flex justify-center items-center'>
                                        <div className='md:w-full h-full relative flex justify-center items-center
                                                        w-full'>
                                            <Image src={'/images/hero/icn_1.png'}
                                                    alt='icon'
                                                    width={450}
                                                    height={583}
                                                    className="object-cover w-full max-w-[300px] md:max-w-[450px]" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="embla__slide">
                        <div className='relative w-full h-full'>
                            <Image src={'/images/hero/bg_2.jpg'}
                                    alt='bg_2'
                                    fill
                                    style={{ objectFit: 'cover' }} />
                            
                            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px]'>
                                <div className='w-full flex flex-col justify-center items-center p-6'>
                                    <h3 className='text-2xl text-center font-semibold tracking-wide text-gray-200 my-2
                                                    md:text-4xl'>
                                        SUMMER
                                    </h3>
                                    <h2 className='text-6xl text-center font-semibold tracking-wide text-gray-100 my-2
                                                    md:text-8xl'>
                                        BIG SALE
                                    </h2>
                                    <h4 className='text-md font-semibold tracking-wide text-gray-600 my-2'>
                                        SELECTED SUMMER STYLE ONLINE ONLY
                                    </h4>
                                    <Link href={'/'} className='w-[300px] h-[40px] flex justify-center items-center bg-white my-6
                                                                text-gray-500 font-bold'>
                                        SHOP NOW
                                    </Link>
                                    <p className='text-sm font-normal text-gray-100 tracking-wide my-6'>
                                        WWWW.ANTORBON.COM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="embla__slide">
                        <div className='relative w-full h-full'>
                            <Image src={'/images/hero/bg_3_1.jpg'}
                                    alt='bg_3'
                                    fill
                                    style={{ filter: 'blur(10px)' }} />

                            <div className='absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center'>
                                <div className='w-full flex flex-col justify-center items-center'>
                                    <h2 className='text-3xl font-normal tracking-wide text-gray-400 my-3
                                                    md:text-4xl'>
                                        TREAT YOURSELF
                                    </h2>
                                    <div className='relative flex justify-center items-center my-3 md:max-w-[400px]'>
                                        <Image src={'/images/hero/icn_3.png'}
                                                alt='icn_3'
                                                width={350}
                                                height={350}
                                                className='max-w-[200px] object-cover
                                                            md:max-w-[350px]' />
                                    </div>
                                    <h3 className='text-1xl font-semibold text-gray-100 my-3 tracking-wide md:text-2xl'>
                                        UPTO 20% OFF!
                                    </h3>
                                    <Link href={'/'} className='w-[200px] h-[40px] flex justify-center items-center my-3 bg-amber-200 text-gray-600 hover:bg-amber-300'>
                                        SHOP NOW
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
  )
}