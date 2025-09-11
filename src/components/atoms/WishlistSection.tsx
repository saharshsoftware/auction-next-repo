"use client";
import { SectionHeader } from "./SectionHeader";
import { FavoriteListCard } from "./FavoriteListCard";
import InstructionWishlistSection from "../molecules/InstructionWishlistSection";

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
  hideSignupButton?: boolean;
}

export function WishlistSection({
  favoriteLists,
  isAuthenticated = false,
  hideSignupButton = false,
}: WishlistSectionProps) {


  if (favoriteLists.length === 0) {
    return (
      <>
        <InstructionWishlistSection isAuthenticated={isAuthenticated} hideSignupButton={hideSignupButton} />
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
