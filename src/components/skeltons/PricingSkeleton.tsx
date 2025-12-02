import React from "react";

/**
 * Skeleton component for individual pricing plan card
 */
const SkeletonPlanCard = () => {
  return (
    <div className="relative flex flex-col h-full rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      {/* Badge skeleton */}
      <div className="absolute -top-2.5 right-4 skeleton h-5 w-16 rounded-full"></div>

      {/* Content wrapper with flex-1 */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <div className="skeleton h-8 w-2/3 mb-2"></div>

        {/* Price display with border */}
        <div className="mb-3 pb-5 border-b border-gray-200">
          <div className="skeleton h-9 w-3/4"></div>
        </div>

        {/* Audience text */}
        <div className="skeleton h-4 w-full mt-2"></div>

        {/* Description */}
        <div className="skeleton h-4 w-full mt-3"></div>
        <div className="skeleton h-4 w-4/5 mt-1"></div>

        {/* Features list */}
        <ul className="mt-5 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <div className="skeleton h-5 w-5 rounded flex-shrink-0 mt-0.5"></div>
              <div className="flex-1">
                <div className="skeleton h-4 w-full"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Action button */}
      <div className="skeleton h-10 w-full rounded-lg mt-6"></div>
    </div>
  );
};

/**
 * Skeleton component for pricing page loading state
 */
const PricingSkeleton = () => {
  return (
    <section className="px-4 lg:px-16 py-10 bg-gray-50">
      <div className="mx-auto flex w-full flex-col gap-8 px-1">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="skeleton h-10 w-64 mx-auto"></div>
          <div className="skeleton h-4 w-96 mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonPlanCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSkeleton;

