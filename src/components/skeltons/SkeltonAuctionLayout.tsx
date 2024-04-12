import React from "react";
import SkeltonAuctionCard from "./SkeltonAuctionCard";

export const Skelton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center">
        <div className="flex gap-4 items-center justify-center">
          <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="skeleton h-4 w-full "></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    </>
  );
};

const SkeltonAuctionLayout = () => {
  const skeletons = Array.from({ length: 5 }, (_, index) => (
    <Skelton key={index} />
  ));

  return (
    <>
      <div className="flex flex-col gap-8 m-4">
        {" "}
        <div className="skeleton h-[70vh] w-full "></div>
        
      </div>
    </>
  );
};

export default SkeltonAuctionLayout;
