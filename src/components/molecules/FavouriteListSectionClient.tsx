"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import FavouriteListFilterWrapper from "@/components/atoms/FavouriteListFilterWrapper";
import { getFavouriteListCarouselData } from "@/services/auction";
import { detectAndCacheUserCity } from "@/utils/userCity";

/**
 * Client-only section that fetches favourite list carousel data excluded from getCarouselData.
 * Refetches on window focus and on an interval so backend updates are reflected in the UI.
 */
const FavouriteListSectionClient = () => {
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [geoCityResolved, setGeoCityResolved] = useState(false);
  const geoDetectionStarted = useRef(false);

  const {
    data: favouriteListCarouselData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["favouriteListCarousel"],
    queryFn: async () => {
      const result = await getFavouriteListCarouselData();
      return result ?? [];
    },
    staleTime: 0,
  });

  // useEffect(() => {
  //   refetch();
  // }, []);

  const hasFavouriteListItems =
    Array.isArray(favouriteListCarouselData) &&
    favouriteListCarouselData.length > 0;

  // Run user-city API once when we first have favourite list data; pass result to all wrappers.
  // Must be called before any conditional return to satisfy Rules of Hooks.
  useEffect(() => {
    if (!hasFavouriteListItems || geoDetectionStarted.current) return;
    geoDetectionStarted.current = true;
    setGeoCityResolved(false);
    detectAndCacheUserCity()
      .then((city) => {
        setDetectedCity(city);
        setGeoCityResolved(true);
      })
      .catch(() => {
        setDetectedCity(null);
        setGeoCityResolved(true);
      });
  }, [hasFavouriteListItems]);

  if (isLoading) {
    return (
      <section className="md:my-auto mt-12" aria-busy="true" aria-label="Loading favourite list">
        <div className="bg-odd-color py-8 text-center text-muted-foreground">
          Loading favourite list…
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="md:my-auto mt-12" aria-label="Favourite list error">
        <div className="bg-odd-color py-8 text-center text-destructive">
          Unable to load favourite list. Please try again later.
        </div>
      </section>
    );
  }

  if (!hasFavouriteListItems) {
    return null;
  }

  return (
    <section className="md:my-auto mt-12" aria-label="Favourite list by city">
      {favouriteListCarouselData.map((item: any, index: number) => (
        <FavouriteListFilterWrapper
          key={item?.id ?? index}
          item={item}
          index={index}
          allItems={favouriteListCarouselData}
          injectedGeo={{ city: detectedCity, resolved: geoCityResolved }}
        />
      ))}
    </section>
  );
};

export default FavouriteListSectionClient;
