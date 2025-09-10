"use client";
import { SectionHeader } from "./SectionHeader";
import { FavoriteListCard } from "./FavoriteListCard";
import { StepsList } from "./StepsList";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { CarouselWrapper } from "./CarouselWrapper";
import { getImageCloudfrontUrl, slugify } from "@/shared/Utilies";
import LoginToCreateCollection from "../ modals/LoginToCreateCollection";
import { useDeviceType } from "@/hooks/useDeviceType";
import { IMAGES_NAME } from "@/shared/Constants";
import { useInstructionImages } from "@/hooks/useInstructionImages";

interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  price: string;
  bank: string;
  area: string;
  image: string;
  auctionStartTime: string;
}

export interface FavoriteListSectionData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  properties: Property[];
}

interface WishlistSectionProps {
  favoriteLists: FavoriteListSectionData[];
  isAuthenticated?: boolean;
}

const instructionsData = [
  {
    id: 1,
    text: "Visit any property detail page",
  },
  {
    id: 2,
    text: "Scroll down to the “Add to List” section",
  },
  {
    id: 3,
    text: "Choose an existing list or create a new one",
  },
  {
    id: 4,
    text: "Click “Add”",
  },
];

export function WishlistSection({
  favoriteLists,
  isAuthenticated = false,
}: WishlistSectionProps) {
  const device = useDeviceType();
  const instImage =
    device === "mobile" || device === "tablet"
      ? [IMAGES_NAME.SEVEN, IMAGES_NAME.EIGHT, IMAGES_NAME.NINE]
      : [IMAGES_NAME.EIGHT, IMAGES_NAME.NINE, IMAGES_NAME.TEN];

  const instructionImages = useInstructionImages(
    instImage,
    "wishlist-instructions"
  );

  if (favoriteLists.length === 0) {
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
              <StepsList steps={instructionsData} />
              <div className="text-center mt-8">
                <LoginToCreateCollection isAuthenticated={isAuthenticated} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SectionHeader
        title="Your Wishlist"
        highlightedText="Collections"
        description="Organize your favorite properties into custom collections. Create multiple wishlists to categorize properties based on your preferences and investment goals."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {favoriteLists.map((list) => (
          <FavoriteListCard
            key={list.id}
            listId={list.id}
            name={list.name}
            description={list.description}
            createdAt={list.createdAt}
            propertyCount={list?.properties?.length || 0}
          />
        ))}
      </div>
    </>
  );
}
