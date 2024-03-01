"use client";
import React from "react";
import AuctionCard from "../atoms/AuctionCard";
import { useRouter, useSearchParams } from "next/navigation";
import { SAMPLE_PLOT } from "@/shared/Constants";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

const ShowAuctionList: React.FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  const router = useRouter();
  const handleClick = (data: any) => {
    router.push(
      ROUTE_CONSTANTS.AUCTION_DETAIL + "/" + data?.id + "?q=" + search
    );
  };
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {SAMPLE_PLOT.map((item, index) => {
          return (
            <>
              <div className="w-full" key={index}>
                <AuctionCard item={item} handleClick={handleClick} />
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ShowAuctionList;
