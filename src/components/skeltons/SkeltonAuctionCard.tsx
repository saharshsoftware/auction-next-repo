import React from "react";

const SkeltonCard = () => {
  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center">
        <div className="flex justify-between">
          <div className="skeleton h-4 w-3/5 "></div>
          <div className="skeleton h-4 w-[10%]"></div>
        </div>
        <div className="flex flex-col gap-4">
          <span>Reserve price</span>
          <div className="skeleton h-4 w-[10%]"></div>
        </div>
        Seller - <div className="skeleton h-4 w-[10%]"></div>
        <div className="flex gap-4 items-center justify-between">
          <div className="skeleton h-4 w-1/4"></div>
          <div className="skeleton h-4 w-1/4"></div>
        </div>
      </div>
    </>
  );
};

const SkeltonAuctionCard = () => {
  const skeletons = Array.from({ length: 5 }, (_, index) => (
    <SkeltonCard key={index} />
  ));

  return (
    <>
      <div className="flex flex-col gap-12 w-full"> {skeletons}</div>
    </>
  );
};

export default SkeltonAuctionCard;
