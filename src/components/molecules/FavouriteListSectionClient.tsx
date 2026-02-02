"use client";

import { useQuery } from "@tanstack/react-query";
import { getFavouriteListCarouselData } from "@/server/actions/auction";
import FavouriteListFilterWrapper from "@/components/atoms/FavouriteListFilterWrapper";

/**
 * Client-only section that fetches favourite list carousel data excluded from getCarouselData.
 * Refetches on window focus and on an interval so backend updates are reflected in the UI.
 */
const FavouriteListSectionClient = () => {
  const {
    data: favouriteListCarouselData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favouriteListCarousel"],
    queryFn: async () => {
      const result = await getFavouriteListCarouselData();
      return result ?? [];
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
    staleTime: 0,
  });

  const hasFavouriteListItems =
    Array.isArray(favouriteListCarouselData) &&
    favouriteListCarouselData.length > 0;

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
        />
      ))}
    </section>
  );
};

export default FavouriteListSectionClient;
