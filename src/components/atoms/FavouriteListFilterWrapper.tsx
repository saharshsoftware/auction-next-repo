"use client";
import React, { useMemo, useEffect, useState } from "react";
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



/* =========================================================
   🆕 GEO LOCATION HELPERS (CLIENT ONLY, NO CORS)
========================================================= */

const USER_CITY_CACHE_KEY = "detected_user_city";

/**
 * Normalize city names like:
 * "Jaipur Municipal Corporation" → "jaipur"
 */
const normalizeCityName = (city: string): string => {
  return city
    .replace(/municipal corporation/i, "")
    .replace(/municipality/i, "")
    .replace(/district/i, "")
    .replace(/city/i, "")
    .trim()
    .toLowerCase();
};

const getUserCoordinates = (): Promise<{ lat: number; lon: number } | null> => {
  return new Promise((resolve) => {
    try {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          } catch {
            resolve(null);
          }
        },
        () => resolve(null),
        { timeout: 8000 }
      );
    } catch {
      resolve(null);
    }
  });
};

const getCityFromCoordinates = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    if (!res.ok) return null;
   
    const data = await res.json();
   
    const address = data.address || {};
   

    const rawCity =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      null;

    if (!rawCity) return null;
    return normalizeCityName(rawCity);
  } catch {
    return null;
  }
};

const detectAndCacheUserCity = async (): Promise<string | null> => {
  try {
    let cached: string | null = null;
    try {
      cached = localStorage.getItem(USER_CITY_CACHE_KEY);
    } catch {
      // localStorage unavailable (e.g. private browsing)
    }
    if (cached) return cached;

    const coords = await getUserCoordinates();
    if (!coords) return null;

    const city = await getCityFromCoordinates(coords.lat, coords.lon);
    if (city) {
      try {
        localStorage.setItem(USER_CITY_CACHE_KEY, city);
      } catch {
        // Ignore cache write failure
      }
    }

    return city;
  } catch {
    return null;
  }
};







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
 * Determines if a favourite list item should be shown when user has interested cities and at least one item matches.
 * When user has interested cities but NO matches, visibility uses geo fallback (shouldShowByGeoCity), not this function.
 */
const shouldShowFavouriteList = (
  itemCity: string | null | undefined,
  userCities: string[],
  hasMatches: boolean
): boolean => {
  // Defensive: when no matches, caller uses geo fallback; if this is still called, show all for safety.
  if (!hasMatches) {
    return true;
  }

  const normalizedItemCity = itemCity?.toLowerCase().trim() ?? null;

  // Hide generic items (city: null) when matching city items are available
  if (normalizedItemCity === null) {
    return false;
  }

  return userCities.includes(normalizedItemCity);
};

/**
 * For guest or logged-in user with no interested city: show only if item's city
 * matches the detected geolocation city. If detection failed or no match, don't show.
 */
const shouldShowByGeoCity = (
  itemCity: string | null | undefined,
  detectedCity: string | null,
  geoCityResolved: boolean
): boolean => {
  if (!geoCityResolved || detectedCity === null) {
    return false;
  }
  const normalizedItemCity = itemCity?.toLowerCase().trim() ?? null;
  return normalizedItemCity !== null && normalizedItemCity === detectedCity;
};

/**
 * Client wrapper that filters favourite list items based on user's interested city.
 * Renders FavouriteListCarousel only if the item passes the city filter.
 */
const FavouriteListFilterWrapper = ({ item, index, allItems }: FavouriteListFilterWrapperProps) => {
  const { isAuthenticated } = useIsAuthenticated();
  const { userProfileData } = useUserProfile(isAuthenticated);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [geoCityResolved, setGeoCityResolved] = useState(false);

  const userInterestedCities = useMemo(
    () => parseInterestedCities(userProfileData?.interestedCities),
    [userProfileData?.interestedCities]
  );



  const isGeoCityMode =
    !isAuthenticated || userInterestedCities.length === 0;

  // Check if any favourite list item matches the user's interested cities (needed before useGeoFallback).
  const hasMatches = useMemo(
    () => hasAnyMatchingCity(allItems, userInterestedCities),
    [allItems, userInterestedCities]
  );

  // Logged-in with interested cities but no matching items: fall back to geolocation city (same logic as guest).
  const useGeoFallback =
    isAuthenticated &&
    userInterestedCities.length > 0 &&
    !hasMatches;

  const runGeoDetection = isGeoCityMode || useGeoFallback;

  // Run geolocation when we filter by detected city: guest/no interested city, or profile no-matches fallback.
  useEffect(() => {
    if (!runGeoDetection) return;
    setGeoCityResolved(false);
    detectAndCacheUserCity()
      .then((city) => {
        setDetectedCity(city);
        setGeoCityResolved(true);
      })
      .catch(() => {
        // Geolocation failed (denied, timeout, or unexpected error) – treat as no city, don't break UI
        setDetectedCity(null);
        setGeoCityResolved(true);
      });
  }, [runGeoDetection]);

  const useGeoCityForFilter = isGeoCityMode || useGeoFallback;

  const shouldShow = useMemo(() => {
    if (useGeoCityForFilter) {
      return shouldShowByGeoCity(item.city, detectedCity, geoCityResolved);
    }
    return shouldShowFavouriteList(item.city, userInterestedCities, hasMatches);
  }, [
    useGeoCityForFilter,
    item.city,
    detectedCity,
    geoCityResolved,
    userInterestedCities,
    hasMatches,
  ]);

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
