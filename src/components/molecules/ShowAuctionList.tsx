import React from "react";
import AuctionCard from "../atoms/AuctionCard";
import { SAMPLE_PLOT } from "@/shared/Constants";
import { redirect } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

const ShowAuctionList = ({ searchParams }: { searchParams: any }) => {
  const handleClick = async (data: any) => {
    "use server";
    redirect(
      ROUTE_CONSTANTS.AUCTION_DETAIL + "/" + data?.id + "?q=" + searchParams?.q
    );
  };
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {SAMPLE_PLOT.map((item, index) => {
          return (
            <div className="w-full" key={index}>
              <AuctionCard item={item} handleClick={handleClick} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ShowAuctionList;
