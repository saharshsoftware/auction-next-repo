"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import { SectionHeader } from "./SectionHeader";
import { FavoriteListCard } from "./FavoriteListCard";
import { PropertyCard } from "./PropertyCard";
import ActionButton from "./ActionButton";
import { StepsList } from "./StepsList";
import useModal from "@/hooks/useModal";
import CreateFavList from "../ modals/CreateFavList";
import { useRouter } from "next/navigation";
import LoginModal from "../ modals/LoginModal";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import CustomReactCarouselForSection from "./CustomReactCarouselForSection";

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

export function WishlistSection({
  favoriteLists,
  isAuthenticated = false,
}: WishlistSectionProps) {
  const router = useRouter();
  const [selectedList, setSelectedList] = useState<FavoriteList | null>(null);
  const { showModal, openModal, hideModal } = useModal();

  const handleCloseCreateFavList = () => {
    hideModal();
    router.refresh();
  };
  const renderModalContainer = () => {
    if (isAuthenticated) {
      return (
        <CreateFavList
          openModal={openModal}
          hideModal={handleCloseCreateFavList}
        />
      );
    }
    return (
      <LoginModal openModal={openModal} hideModal={handleCloseCreateFavList} />
    );
  };
  if (favoriteLists.length === 0) {
    return (
      <>
        <SectionHeader
          title="Your Wishlist"
          highlightedText="Collections"
          description="Organize your favorite properties into custom collections. Create multiple wishlists to categorize properties based on your preferences and investment goals."
        />

        <div className="py-12">
          <div className="flex flex-col lg:flex-row gap-8 sm:max-w-6xl mx-auto items-center lg:items-start">
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
              <div className="relative sm:max-w-md sm:w-full w-80 mx-auto lg:mx-0">
                <CustomReactCarouselForSection>
                  <Image
                    src={require("@/assets/images/8.png")}
                    alt="How to save searches"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg w-full"
                  />
                  <Image
                    src={require("@/assets/images/9.png")}
                    alt="How to save searches"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md w-full"
                  />
                  <Image
                    src={require("@/assets/images/10.png")}
                    alt="How to save searches"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md w-full"
                  />
                </CustomReactCarouselForSection>
              </div>
            </div>
            <div className="flex-1 w-full lg:self-center">
              <StepsList steps={instructionsData} />
              <div className="text-center mt-8">
                <ActionButton
                  text="Login To Create Collection"
                  onclick={showModal}
                  iconLeft={
                    <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {openModal ? renderModalContainer() : null}
      </>
    );
  }

  const handleClick = (name: string) => {
    router.push(`${ROUTE_CONSTANTS.MANAGE_LIST}#${name?.toLowerCase()}`);
  };
  return (
    <>
      <SectionHeader
        title="Your Wishlist"
        highlightedText="Collections"
        description="Organize your favorite properties into custom collections. Create multiple wishlists to categorize properties based on your preferences and investment goals."
      />

      {!selectedList ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {favoriteLists.map((list) => (
              <FavoriteListCard
                key={list.id}
                listId={list.id}
                name={list.name}
                description={list.description}
                createdAt={list.createdAt}
                propertyCount={list?.properties?.length || 0}
                onViewProperties={handleClick}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <ActionButton
              text=" Back to Collections"
              onclick={() => setSelectedList(null)}
              iconLeft={
                <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4 " />
              }
            />
            <h3 className="text-xl font-medium">{selectedList.name}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedList.properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
