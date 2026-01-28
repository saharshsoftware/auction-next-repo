"use client";
import React, { useMemo } from "react";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import { useUserProfile } from "@/hooks/useUserProfile";
import FavouriteListCarousel from "./FavouriteListCarousel";

interface FavouriteListItem {
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  subTitle?: string;
  componentName?: string;
  city?: string | null;
  collectionData?: any[];
  [key: string]: any;
}

interface FavouriteListFilterWrapperProps {
  item: FavouriteListItem;
  index: number;
  allItems: FavouriteListItem[];
}

/**
 * Extracts user's interested cities from profile data as a normalized array.
 */
const parseInterestedCities = (interestedCities: string | undefined | null): string[] => {
  if (!interestedCities) return [];
  return interestedCities
    .split(",")
    .map(city => city.trim().toLowerCase())
    .filter(city => city.length > 0);
};

/**
 * Checks if any item in the list matches the user's interested cities.
 */
const hasAnyMatchingCity = (
  allItems: FavouriteListItem[],
  userCities: string[]
): boolean => {
  if (userCities.length === 0) return false;
  
  return allItems.some(item => {
    const normalizedCity = item.city?.toLowerCase().trim() ?? null;
    return normalizedCity !== null && userCities.includes(normalizedCity);
  });
};

/**
 * Determines if a favourite list item should be shown based on user's city preference.
 * 
 * Use cases:
 * 1. User not logged in → show all items
 * 2. User logged in, no interested city → show all items
 * 3. User logged in with interested city, matches exist → show ONLY matching city items
 * 4. User logged in with interested city, NO matches exist → show all items (fallback)
 */
const shouldShowFavouriteList = (
  itemCity: string | null | undefined,
  isAuthenticated: boolean,
  userCities: string[],
  hasMatches: boolean
): boolean => {
  // Case 1 & 2: Not authenticated OR no city preference → show all items
  if (!isAuthenticated || userCities.length === 0) {
    return true;
  }

  // Case 4: User has city preference but no items match → fallback to show all
  if (!hasMatches) {
    return true;
  }

  const normalizedItemCity = itemCity?.toLowerCase().trim() ?? null;
  
  // Case 3: User has interested cities and matches exist → show ONLY matching items
  // Hide generic items (city: null) when matching city items are available
  if (normalizedItemCity === null) {
    return false;
  }
  
  return userCities.includes(normalizedItemCity);
};

/**
 * Client wrapper that filters favourite list items based on user's interested city.
 * Renders FavouriteListCarousel only if the item passes the city filter.
 */
const FavouriteListFilterWrapper = ({ item, index, allItems }: FavouriteListFilterWrapperProps) => {
  const { isAuthenticated } = useIsAuthenticated();
  const { userProfileData } = useUserProfile(isAuthenticated);

  const userInterestedCities = useMemo(
    () => parseInterestedCities(userProfileData?.interestedCities),
    [userProfileData?.interestedCities]
  );

  // Check if any favourite list item matches the user's interested cities
  const hasMatches = useMemo(
    () => hasAnyMatchingCity(allItems, userInterestedCities),
    [allItems, userInterestedCities]
  );

  const shouldShow = useMemo(
    () => shouldShowFavouriteList(item.city, isAuthenticated, userInterestedCities, hasMatches),
    [item.city, isAuthenticated, userInterestedCities, hasMatches]
  );

  // Hide items with no collection data (empty carousel would be pointless)
  const hasValidData = item.collectionData && item.collectionData.length > 0;

  if (!shouldShow || !hasValidData) {
    return null;
  }

  // Alternate background colors for visual separation
  const backgroundClass = index % 2 !== 0 ? "bg-even-color" : "bg-odd-color";

  return (
    <div className={backgroundClass}>
      <FavouriteListCarousel
        title={item.title ?? ""}
        desc={item.description ?? ""}
        subTitle={item.subTitle ?? ""}
        items={item.collectionData ?? []}
      />
    </div>
  );
};

export default FavouriteListFilterWrapper;
