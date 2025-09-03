"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
interface ImageCarouselProps {
  images: string[];
  title?: string;
  className?: string;
  onImageError?: () => void;
  propertyData?: {
    type?: string;
    city?: string;
    area?: string;
    bankName?: string;
  };
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title = 'Property Images', className = '', onImageError, propertyData }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const mainSliderRef = useRef<Slider | null>(null);

  const modalSliderRef = useRef<Slider | null>(null);
  const validImages = useMemo(() => (images || []).filter((_, index) => !failedImages.has(index)), [images, failedImages]);
  
  const generateAltText = (index: number, isFullscreen = false) => {
    const { type, city, area, bankName } = propertyData || {};
    const baseAlt = title || 'Property';
    const imageNumber = index + 1;
    const totalImages = validImages.length;
    
    let altText = `${baseAlt} image ${imageNumber} of ${totalImages}`;
    
    if (type) altText += ` - ${type}`;
    if (area) altText += ` in ${area}`;
    if (city) altText += `, ${city}`;
    if (bankName) altText += ` | ${bankName} auction property`;
    if (isFullscreen) altText += ' - Full size view';
    
    return altText;
  };
  if (!images || images.length === 0) {
    return <div className={`bg-gray-200 rounded-lg flex items-center justify-center h-96 ${className}`}><span className="text-gray-500">No images available</span></div>;
  }
  if (validImages.length === 0) {
    return (
      <div className={`relative bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div className="relative w-full h-[500px] overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image not available</span>
        </div>
      </div>
    );
  }
  const handleImageError = (imageIndex: number) => {
    setFailedImages(prev => new Set(Array.from(prev).concat(imageIndex)));
    if (imageIndex === currentIndex && validImages.length > 1) {
      const nextValidIndex = (currentIndex + 1) % validImages.length;
      setCurrentIndex(nextValidIndex);
      if (mainSliderRef.current) mainSliderRef.current.slickGoTo(nextValidIndex, true);
      if (modalSliderRef.current) modalSliderRef.current.slickGoTo(nextValidIndex, true);
    }
    if (onImageError) onImageError();
  };
  const mainSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    beforeChange: (_: number, next: number) => setCurrentIndex(next)
  } as const;
  const modalSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentIndex,
    beforeChange: (_: number, next: number) => setCurrentIndex(next)
  } as const;
  return (
    <>
      <div className={`relative bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div className="relative w-full h-[500px] overflow-hidden rounded-t-lg">
          <Slider ref={instance => (mainSliderRef.current = instance)} {...mainSettings}>
            {validImages.map((src, index) => (
              <div key={index} className="w-full h-[500px] bg-gray-100 flex items-center justify-center" onClick={() => setIsModalOpen(true)}>
                <img 
                  src={src} 
                  alt={generateAltText(index)} 
                  title={generateAltText(index)}
                  className="w-full h-full object-contain select-none" 
                  onError={() => handleImageError(index)}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </Slider>
          {validImages.length > 1 && (
            <>
              <button onClick={() => mainSliderRef.current?.slickPrev()} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => mainSliderRef.current?.slickNext()} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{currentIndex + 1} / {validImages.length}</div>
          {/* Fullscreen icon */}
          <button aria-label="Open fullscreen" onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-md">
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>

      </div>
      {isModalOpen && (
         <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
           <button aria-label="Exit fullscreen" onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }} className="absolute top-4 right-4 z-[10000] pointer-events-auto text-white bg-black/60 hover:bg-black/80 p-2 rounded-md">
             <Minimize2 className="h-5 w-5" />
           </button>
           <div className="relative w-screen h-screen" onClick={(e) => e.stopPropagation()}>
             {validImages.length > 0 ? (
               <Slider ref={instance => (modalSliderRef.current = instance)} {...modalSettings}>
                 {validImages.map((src, index) => (
                   <div key={index} className="w-screen h-screen flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                     <img 
                       src={src} 
                       alt={generateAltText(index, true)} 
                       title={generateAltText(index, true)}
                       className="w-full h-full object-contain select-none" 
                       onError={() => handleImageError(index)} 
                       onClick={(e) => e.stopPropagation()} 
                     />
                   </div>
                 ))}
               </Slider>
             ) : (
               <div className="w-screen h-screen flex items-center justify-center text-white">Image not available</div>
             )}
             {validImages.length > 1 && (
               <>
                 <button onClick={() => modalSliderRef.current?.slickPrev()} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full">
                   <ChevronLeft className="h-6 w-6" />
                 </button>
                 <button onClick={() => modalSliderRef.current?.slickNext()} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full">
                   <ChevronRight className="h-6 w-6" />
                 </button>
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{currentIndex + 1} / {validImages.length}</div>
               </>
             )}
             
             {/* Mobile-only cross button at bottom of fullscreen modal */}
             <button 
               aria-label="Close fullscreen" 
               className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition-all z-[10001]"
               onClick={(e) => { 
                 e.stopPropagation(); 
                 setIsModalOpen(false);
               }}
             >
               <X className="h-6 w-6" />
             </button>
           </div>
         </div>
       )}
    </>
  );
};