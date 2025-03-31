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
            <div className="lg:col-span-8 col-span-full">
              <ShowAuctionList />
            </div>
            <div className="lg:col-span-4 col-span-full">
              <RecentData />
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default AuctionLayoutClient;
