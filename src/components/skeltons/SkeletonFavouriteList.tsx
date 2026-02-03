"use client";

import React from "react";

/**
 * Skeleton placeholder for a single collection card in the favourite list carousel.
 * Mirrors FavouriteListCollectionCard layout: image (aspect 5/3) + title, description, CTA.
 */
const SkeletonFavouriteListCard = () => (
  <div className="w-full h-full flex flex-col rounded-lg overflow-hidden shadow-sm bg-white border border-gray-200">
    <div className="skeleton w-full aspect-[5/3] flex-shrink-0 rounded-none" />
    <div className="flex flex-col flex-1 p-3 sm:p-4 md:p-5 h-[140px] sm:h-[150px] md:h-[160px] justify-between">
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
      </div>
      <div className="pt-2 sm:pt-3">
        <div className="skeleton h-5 w-20 rounded" />
      </div>
    </div>
  </div>
);

const CAROUSEL_BLOCK_COUNT = 2;

/**
 * Skeleton for one carousel block: header (subTitle, title, desc) + row of card placeholders.
 * Matches FavouriteListCarousel structure and padding.
 */
const SkeletonFavouriteListCarouselBlock = ({
  backgroundClass,
}: {
  backgroundClass: "bg-odd-color" | "bg-even-color";
}) => (
  <div className={backgroundClass}>
    <div className="carousel-container common-section py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="flex flex-col items-center justify-center text-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-full md:w-4/5 lg:w-3/5 mx-auto mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
        <div className="skeleton h-4 w-[15%] mx-auto" />
        <div className="skeleton h-8 w-3/5 mx-auto" />
        <div className="skeleton h-4 w-4/5 mx-auto" />
        <div className="skeleton h-4 w-3/5 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonFavouriteListCard key={index} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton for the Favourite list section while carousel data is loading.
 * Renders 2 carousel-style blocks with alternating backgrounds to match FavouriteListFilterWrapper.
 */
const SkeletonFavouriteList = () => (
  <section
    className="md:my-auto mt-12"
    aria-busy="true"
    aria-label="Loading favourite list"
  >
    {Array.from({ length: CAROUSEL_BLOCK_COUNT }).map((_, index) => (
      <SkeletonFavouriteListCarouselBlock
        key={index}
        backgroundClass={index % 2 === 0 ? "bg-odd-color" : "bg-even-color"}
      />
    ))}
  </section>
);

export default SkeletonFavouriteList;
