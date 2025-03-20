import React from "react";

const SkeletonFilter = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-200 rounded">
      <div className="skeleton h-10 w-[15%]"></div>
      <div className="skeleton h-10 w-[15%]"></div>
      <div className="skeleton h-10 w-[15%]"></div>
      <div className="skeleton h-10 w-[15%]"></div>
      <div className="skeleton h-10 w-[20%]"></div>
      <div className="skeleton h-10 w-[10%]"></div>
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
    <div className="flex flex-col w-1/4 bg-gray-200 rounded p-4">
      <div className="skeleton h-8 w-1/2 mb-4"></div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="skeleton h-6 w-full mb-2"></div>
      ))}
    </div>
  );
};

const SkeletonAuctionPage = () => {
  return (
    <div className="flex flex-col gap-6 ">
      <SkeletonFilter />
      <div className="flex gap-6 common-section">
        <div className="flex flex-col gap-6 w-3/4">
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonAuctionCard key={index} />
          ))}
        </div>
        <SkeletonSidebar />
      </div>
    </div>
  );
};

export default SkeletonAuctionPage;
