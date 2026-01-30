"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getLocationFromIP } from "@/shared/ipLocation";
import FavouriteListCarousel from "./FavouriteListCarousel";

// Shared promise so all instances get the same IP-based city (single fetch)
let ipCityPromise: Promise<string | null> | null = null;
const getIpCityOnce = (): Promise<string | null> => {
  if (!ipCityPromise) ipCityPromise = getLocationFromIP();
  return ipCityPromise;
};

/** Hook that returns user's city from IP (cached, single fetch across all instances). */
function useLocationFromIP(): string | null | undefined {
  const [city, setCity] = useState<string | null | undefined>(undefined);
  const resolved = useRef(false);
  useEffect(() => {
    if (resolved.current) return;
    resolved.current = true;
    getIpCityOnce().then((c) => {
      console.log("[useLocationFromIP] User location (IP):", c ?? null);
      setCity(c ?? null);
    });
  }, []);
  return city;
}

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
 * Normalizes city string for comparison (lowercase, trimmed).
 */
const normalizeCity = (city: string | null | undefined): string | null => {
  const s = city?.trim?.();
  return typeof s === "string" && s.length > 0 ? s.toLowerCase() : null;
};

/**
 * Determines if a favourite list item should be shown based on user's city preference.
 *
 * Use cases:
 * 1. User not logged in / no interested cities → show favourite list of nearest location (from IP)
 * 2. User logged in with interested city, matches exist → show ONLY matching city items
 * 3. User logged in with interested city, NO matches exist → show all items (fallback)
 */
const shouldShowFavouriteList = (
  itemCity: string | null | undefined,
  isAuthenticated: boolean,
  userCities: string[],
  hasMatches: boolean,
  ipCity: string | null | undefined
): boolean => {
  const normalizedItemCity = normalizeCity(itemCity);

  // Use IP-based nearest location when not logged in OR no interested cities
  if (!isAuthenticated || userCities.length === 0) {
    if (ipCity === undefined) return false; // Still loading: show nothing until we have IP city
    if (ipCity === null) return true; // Fetch failed: show all as fallback
    return normalizedItemCity !== null && normalizeCity(ipCity) === normalizedItemCity;
  }

  // User has city preference but no items match → fallback to show all
  if (!hasMatches) {
    return true;
  }

  // User has interested cities and matches exist → show ONLY matching items
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
  const ipCity = useLocationFromIP();

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
    () =>
      shouldShowFavouriteList(
        item.city,
        isAuthenticated,
        userInterestedCities,
        hasMatches,
        ipCity
      ),
    [item.city, isAuthenticated, userInterestedCities, hasMatches, ipCity]
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
