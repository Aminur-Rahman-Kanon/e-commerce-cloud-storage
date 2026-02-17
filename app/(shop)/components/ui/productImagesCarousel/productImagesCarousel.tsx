'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    images: string[]
}

export default function ProductImagesCarousel ({ images }: Props){
    const [ emblaRef, emblaApi ] = useEmblaCarousel({ loop: false });

    if (!images.length) return;

    const displayImages = images.map((img, idx) => <div key={idx} className='embla__slide'>
        <div className='relative w-full h-[450px]
                        md:h-[600px]
                        lg:h-[700px]
                        ex'>
            <Image src={img}
                    alt='antorbon'
                    fill
                    className='object-cover' />
        </div>
    </div>)

    const nextBtn = () => emblaApi?.scrollNext();
    const prevBtn = () => emblaApi?.scrollPrev();

    return (
        <div className='relative w-full h-full'>
            <div className='w-full mx-auto'>
                <div className='embla__viewport' ref={emblaRef}>
                    <div className='embla__container'>
                        { displayImages }
                    </div>
                </div>
            </div>

            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between items-center'>
                <button className ='w-[50px] h-[50px] flex justify-center items-center'
                        onClick={prevBtn}>
                    <ChevronLeft size={30} color='white'/>
                </button>
                <button className ='w-[50px] h-[50px] flex justify-center items-center'
                        onClick={nextBtn}>
                    <ChevronRight size={30} color='white'/>
                </button>
            </div>
        </div>
    )
}
