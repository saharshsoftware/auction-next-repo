"use client"
import React from 'react'
import { CarouselWrapper } from '../atoms/CarouselWrapper'
import { SectionHeader } from '../atoms/SectionHeader'
import { StepsList } from '../atoms/StepsList'
import { ALERTS_INSTRUCTIONS_DATA, IMAGES_NAME } from '@/shared/Constants'
import LoginToCreateAlert from '../ modals/LoginToCreateAlert'
import { useInstructionImages } from '@/hooks/useInstructionImages'
import { useDeviceType } from '@/hooks/useDeviceType'

interface InstructionAlertSectionProps {
  hideSignupButton?: boolean;
  isAuthenticated: boolean;
  isHowToCreateRoute?: boolean;
}

const InstructionAlertSection = (
  { hideSignupButton, isAuthenticated, isHowToCreateRoute = false }
    : InstructionAlertSectionProps
) => {
  const device = useDeviceType();

  const instImage =
    device === "mobile" || device === "tablet"
      ? [IMAGES_NAME.FOUR, IMAGES_NAME.FIVE, IMAGES_NAME.SIX]
      : [IMAGES_NAME.FIVE, IMAGES_NAME.SIX, IMAGES_NAME.SEVEN];

  const instructionImages = useInstructionImages(
    instImage,
    "alerts-instructions"
  );
  return (
    <>
      <SectionHeader
        title="Smart Property"
        highlightedText="Alerts"
        description="Never miss your dream property! Get instant notifications when properties matching your criteria hit the market. Set up personalized alerts and stay ahead of other buyers."
      />

      <div className="py-12">
        <div className="flex flex-col-reverse lg:flex-row  lg:gap-8 sm:max-w-6xl mx-auto items-center lg:items-start">
          <div className="flex-1 w-full lg:self-center">
            <StepsList steps={ALERTS_INSTRUCTIONS_DATA} />
            {!hideSignupButton && <div className="text-center mt-8">
              <LoginToCreateAlert isAuthenticated={isAuthenticated} isHowToCreateRoute={isHowToCreateRoute} />
            </div>}
          </div>
          <div className="flex-1 lg:self-center">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl font-semibold mb-4">
                Stay Ahead with Property Alerts
              </h3>
              <p className="text-sm-xs">
                Be the first to know when your perfect property becomes
                available. Follow these steps to set up your personalized
                alerts.
              </p>
            </div>
            {/* <div className="relative w-full sm:max-w-md mx-auto lg:mx-0"> */}
            <div className="relative sm:max-w-md sm:w-full w-80 mx-auto lg:mx-0 ">
              <CarouselWrapper images={instructionImages} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InstructionAlertSection