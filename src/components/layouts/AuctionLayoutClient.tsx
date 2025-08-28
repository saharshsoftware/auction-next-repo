"use client";
import React, { Suspense } from "react";
import RecentData from "../molecules/RecentData";
import SkeletonAuctionPage from "../skeltons/SkeletonAuctionPage";
import ShowAuctionList from "../molecules/ShowAuctionList";
import FindAuction from "../molecules/FindAuction";

const AuctionLayoutClient = () => {
  return (
    <Suspense fallback={<SkeletonAuctionPage />}>
      <section>
        <FindAuction />
        <div className={`common-section`}>
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="grid-col-span-9 ">
              <ShowAuctionList />
            </div>
            <div className="grid-col-span-3">
              <RecentData />
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default AuctionLayoutClient;
