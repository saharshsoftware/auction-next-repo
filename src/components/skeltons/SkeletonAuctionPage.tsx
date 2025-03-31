import React from "react";

export const SkeletonFilter = () => {
  return (
    <div className="flex items-center gap-3  bg-gray-200 rounded common-section p-4 h-16 lg:h-24 ">
      <div className="skeleton h-8 w-24 rounded-md"></div>
      <div className="skeleton h-8 w-36 rounded-md"></div>
      <div className="skeleton h-8 w-8 rounded-md"></div>
    </div>
  );
};

const SkeletonAuctionCard = () => {
  return (
    <div className="flex flex-col gap-4 w-full border rounded shadow p-4 min-h-40">
      <div className="skeleton h-6 w-2/3"></div>
      <div className="skeleton h-4 w-1/4"></div>
      <div className="skeleton h-4 w-1/5"></div>
      <div className="skeleton h-4 w-1/3"></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="flex gap-4 items-center justify-between">
        <div className="skeleton h-10 w-1/4"></div>
        <div className="skeleton h-10 w-1/6"></div>
      </div>
    </div>
  );
};

const SkeletonSidebar = () => {
  return (
    <div className="bg-gray-200 rounded p-4">
      <div className="skeleton h-8 w-1/2 mb-4"></div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="skeleton h-6 w-full mb-2"></div>
      ))}
    </div>
  );
};

const SkeletonAuctionPage = () => {
  return (
    <div className="flex flex-col gap-6 mb-2">
      <SkeletonFilter />
      <div className="grid grid-cols-12 gap-4 common-section">
        <div className="lg:col-span-8 col-span-full flex flex-col gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonAuctionCard key={index} />
          ))}
        </div>
        <div className="lg:col-span-4 col-span-full">
          <SkeletonSidebar />
        </div>
      </div>
    </div>
  );
};

export default SkeletonAuctionPage;
