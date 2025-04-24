import { SectionHeader } from "./SectionHeader";
import { FavoriteListCard } from "./FavoriteListCard";
import { StepsList } from "./StepsList";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { CarouselWrapper } from "./CarouselWrapper";
import { getImageCloudfrontUrl, slugify } from "@/shared/Utilies";
import LoginToCreateCollection from "../ modals/LoginToCreateCollection";

interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  price: string;
  bank: string;
  area: string;
  image: string;
  auctionDate: string;
}

interface FavoriteList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  properties: Property[];
}

interface WishlistSectionProps {
  favoriteLists: FavoriteList[];
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

const IMAGES_NAME = {
  EIGHT: "8",
  NINE: "9",
  TEN: "10",
};

export function WishlistSection({
  favoriteLists,
  isAuthenticated = false,
}: WishlistSectionProps) {
  const instructionImages = [
    IMAGES_NAME.EIGHT,
    IMAGES_NAME.NINE,
    IMAGES_NAME.TEN,
  ].map((item) =>
    getImageCloudfrontUrl(
      typeof item === "string" ? item : item,
      "wishlist-instructions"
    )
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
                <p className="text-gray-600">
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
