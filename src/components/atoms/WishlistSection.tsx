"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faChevronLeft,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
// import { Button } from "@/components/ui/button";

import { SectionHeader } from "./SectionHeader";
import { FavoriteListCard } from "./FavoriteListCard";
import { PropertyCard } from "./PropertyCard";
import ActionButton from "./ActionButton";

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
  id: number;
  name: string;
  description: string;
  createdAt: string;
  properties: Property[];
}

interface WishlistSectionProps {
  favoriteLists: FavoriteList[];
}

export function WishlistSection({ favoriteLists }: WishlistSectionProps) {
  const [selectedList, setSelectedList] = useState<FavoriteList | null>(null);
  if (favoriteLists.length === 0) {
    return (
      <>
        <SectionHeader
          title="Your Wishlist"
          highlightedText="Collections"
          description="Organize your favorite properties into custom collections. Create multiple wishlists to categorize properties based on your preferences and investment goals."
        />

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FontAwesomeIcon
              icon={faBookmark}
              className="h-8 w-8 text-gray-400"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Collections Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first collection to start organizing your favorite
            properties.
          </p>
        </div>
      </>
    );
  }

  const handleClick = () => {
    // Handle card click event here
    alert("Coming soon!");
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
                name={list.name}
                description={list.description}
                createdAt={list.createdAt}
                propertyCount={list?.properties?.length || 0}
                onViewProperties={() => handleClick()}
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
