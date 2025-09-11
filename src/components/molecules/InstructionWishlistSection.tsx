"use client"
import React from 'react'
import { CarouselWrapper } from '../atoms/CarouselWrapper'
import { SectionHeader } from '../atoms/SectionHeader'
import { StepsList } from '../atoms/StepsList'
import { IMAGES_NAME, WISHLIST_INSTRUCTIONS_DATA } from '@/shared/Constants'
import { useInstructionImages } from '@/hooks/useInstructionImages'
import { useDeviceType } from '@/hooks/useDeviceType'
import LoginToCreateCollection from '../ modals/LoginToCreateCollection'

interface InstructionWishlistSectionProps {
  isAuthenticated: boolean;
  hideSignupButton?: boolean;
}

const InstructionWishlistSection = ({ isAuthenticated, hideSignupButton }: InstructionWishlistSectionProps) => {
  const device = useDeviceType();
  const instImage =
    device === "mobile" || device === "tablet"
      ? [IMAGES_NAME.SEVEN, IMAGES_NAME.EIGHT, IMAGES_NAME.NINE]
      : [IMAGES_NAME.EIGHT, IMAGES_NAME.NINE, IMAGES_NAME.TEN];

  const instructionImages = useInstructionImages(
    instImage,
    "wishlist-instructions"
  );
  return (
    <>
      <SectionHeader
        title="Your Wishlist"
        highlightedText="Collections"
        description="Organize your favorite properties into custom collections. Create multiple wishlists to categorize properties based on your preferences and investment goals."
      />

      <div className="py-12">
        <div className="flex flex-col lg:flex-row lg:gap-8 sm:max-w-6xl mx-auto items-center lg:items-start">
          <div className="flex-1 lg:self-center">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl font-semibold mb-4">
                Start Building Your Collection
              </h3>
              <p className="text-sm-xs">
                Creating a wishlist helps you keep track of properties
                you&#39;re interested in. Follow these simple steps to get
                started with your first collection.
              </p>
            </div>
            {/* <div className="relative w-full max-w-md mx-auto lg:mx-0"> */}
            <div className="relative sm:max-w-md sm:w-full w-80 mx-auto lg:mx-0 min-h-[300px]">
              <CarouselWrapper images={instructionImages} />
            </div>
          </div>
          <div className="flex-1 w-full lg:self-center">
            <StepsList steps={WISHLIST_INSTRUCTIONS_DATA} />
            {!hideSignupButton && <div className="text-center mt-8">
              <LoginToCreateCollection isAuthenticated={isAuthenticated} />
            </div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default InstructionWishlistSection