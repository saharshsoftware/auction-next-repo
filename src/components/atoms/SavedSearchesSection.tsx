"use client";
import { SavedSearchCard } from "./SavedSearchCard";
import { SectionHeader } from "./SectionHeader";
import { StepsList } from "./StepsList";
import { IMAGES } from "@/shared/Images";
import { CarouselWrapper } from "./CarouselWrapper";
import { getImageCloudfrontUrl } from "@/shared/Utilies";
import { useDeviceType } from "@/hooks/useDeviceType";
import { IMAGES_NAME } from "@/shared/Constants";
import { useInstructionImages } from "@/hooks/useInstructionImages";

interface SavedSearch {
  id: number;
  name: string;
  filters: string;
  lastUpdated: string;
  matchCount: number;
}

interface SavedSearchesSectionProps {
  savedSearches: SavedSearch[];
}

const instructionsData = [
  {
    id: 1,
    text: "Use filters to search for properties",
  },
  {
    id: 2,
    text: "Click the “Save this Search” button shown in the top",
  },
  {
    id: 3,
    text: "Name your search for easy reference",
  },
  {
    id: 4,
    text: "Access it anytime from “Your Saved Searches”",
  },
];

export function SavedSearchesSection({
  savedSearches,
}: SavedSearchesSectionProps) {
  const device = useDeviceType();
  const instImage =
    device === "mobile" || device === "tablet"
      ? [IMAGES_NAME.ONE, IMAGES_NAME.TWO, IMAGES_NAME.THREE]
      : [IMAGES_NAME.ONE, IMAGES_NAME.TWO, IMAGES_NAME.THREE, IMAGES_NAME.FOUR];

  const instructionImages = useInstructionImages(
    instImage,
    "saved-search-instructions"
  );

  if (savedSearches.length === 0) {
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
              <StepsList steps={instructionsData} />
            </div>
          </div>
        </div>
      </>
    );
  }

  const gridCols =
    savedSearches.length === 1
      ? "md:grid-cols-1"
      : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <SectionHeader
        title="Your Saved"
        highlightedText="Searches"
        description="Access your customized property searches instantly! We'll keep track of your preferred filters and show you new matches as they become available."
      />

      <div
        className={`grid grid-cols-1 ${gridCols} gap-6 mb-8 ${
          savedSearches.length === 1 ? "max-w-md mx-auto" : ""
        }`}
      >
        {savedSearches.map((search) => (
          <SavedSearchCard key={search.id} name={search.name} data={search} />
        ))}
      </div>
    </>
  );
}
