/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  title?: string;
  className?: string;
  onImageError?: () => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  title = 'Property Images',
  className = '',
  onImageError
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center h-96 ${className}`}>
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  // Filter out failed images
  const validImages = images.filter((_, index) => !failedImages.has(index));

  if (validImages.length === 0) {
    // Return null instead of a fallback message - let parent component handle this
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (imageIndex: number) => {
    setFailedImages(prev => new Set(Array.from(prev).concat(imageIndex)));
    
    // If the current image failed, move to the next valid image
    if (imageIndex === currentIndex && validImages.length > 1) {
      const nextValidIndex = validImages.findIndex((_, index) => !failedImages.has(index) && index !== imageIndex);
      if (nextValidIndex !== -1) {
        setCurrentIndex(nextValidIndex);
      }
    }
    
    // Notify parent component about image error
    if (onImageError) {
      onImageError();
    }
  };

  return (
    <>
      <div className={`relative bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        {/* Main Image */}
        <div className="relative w-full h-[500px] overflow-hidden rounded-t-lg">
          <img
            src={validImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain bg-gray-100"
            onError={() => handleImageError(currentIndex)}
          />
          
          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {validImages.length > 1 && (
          <div className="p-4 bg-gray-50">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    currentIndex === index
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    onError={() => handleImageError(index)}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};