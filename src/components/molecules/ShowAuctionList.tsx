import React from "react";
import AuctionCard from "../atoms/AuctionCard";
import { redirect } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import { sanitizedAuctionData } from "@/shared/Utilies";
import { SAMPLE_PLOT2 } from "@/shared/Constants";

const ShowAuctionList = ({
  searchParams,
  responseData,
}: {
  searchParams: any;
  responseData: IAuction[];
}) => {
  const handleClick = async (data: any) => {
    "use server";
    redirect(
      ROUTE_CONSTANTS.AUCTION_DETAIL + "/" + data?.id + "?q=" + searchParams?.q
    );
  };
  // const auctionData = sanitizedAuctionData(SAMPLE_PLOT2) as unknown as IAuction;

  if (responseData?.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-1/2">
        <p>No Result found</p>
        <span>(Try using another filter)</span>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {responseData.map((item: IAuction, index: number) => {
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
