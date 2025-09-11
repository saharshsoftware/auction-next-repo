"use client"
import React from 'react'
import { CarouselWrapper } from '../atoms/CarouselWrapper'
import { SectionHeader } from '../atoms/SectionHeader'
import { StepsList } from '../atoms/StepsList'
import { IMAGES_NAME, SAVED_SEARCH_INSTRUCTIONS_DATA } from '@/shared/Constants'
import { useInstructionImages } from '@/hooks/useInstructionImages'
import { useDeviceType } from '@/hooks/useDeviceType'

const InstructionSavedSearchesSection = () => {
  const device = useDeviceType();
  const instImage =
    device === "mobile" || device === "tablet"
      ? [IMAGES_NAME.ONE, IMAGES_NAME.TWO, IMAGES_NAME.THREE]
      : [IMAGES_NAME.ONE, IMAGES_NAME.TWO, IMAGES_NAME.THREE, IMAGES_NAME.FOUR];

  const instructionImages = useInstructionImages(
    instImage,
    "saved-search-instructions"
  );
  return (
    <>
      <SectionHeader
        title="Quick Access"
        highlightedText="Searches"
        description="Save time on your property hunt! Store your search preferences and filters for instant access. Get notified about new properties that match your saved criteria."
      />

      <div className="py-12">
        <div className="flex flex-col lg:flex-row lg:gap-8 sm:max-w-6xl mx-auto items-stretch lg:items-start ">
          <div className="flex-1 lg:self-center">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl font-semibold mb-4">
                Streamline Your Property Search
              </h3>
              <p className="text-sm-xs">
                Stop repeating your search filters every time. Save your
                preferences once and access them instantly with these simple
                steps.
              </p>
            </div>
            {/* <div className="relative w-full max-w-md mx-auto lg:mx-0"> */}
            <div className="relative sm:max-w-md sm:w-full w-80 mx-auto lg:mx-0 ">
              <CarouselWrapper images={instructionImages} />
            </div>
          </div>
          <div className="flex-1 w-full lg:self-center">
            <StepsList steps={SAVED_SEARCH_INSTRUCTIONS_DATA} />
          </div>
        </div>
      </div>
    </>
  )
}

export default InstructionSavedSearchesSection