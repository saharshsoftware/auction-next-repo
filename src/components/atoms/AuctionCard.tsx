"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { formatPrice, formattedDate } from "../../shared/Utilies";
import { IAuction } from "@/types";

interface IAuctionCard {
  item?: IAuction;
  handleClick?: (data: any) => void;
}
const AuctionCard: React.FC<IAuctionCard> = (props) => {
  const { item, handleClick = () => {} } = props;
  return (
    <>
      <div className="flex flex-col gap-4 p-4 border rounded shadow w-full min-h-40">
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class line-clamp-1 lg:w-3/5">{item?.title} </h2>
          <span className="custom-prize-color font-bold text-2xl">
            {formatPrice(item?.reservePrice)}
          </span>
        </div>
        <p className="flex-1 line-clamp-4">{item?.bankName}</p>
        <p className="flex-1 line-clamp-4">{item?.location}</p>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <div className="flex items-center justify-start gap-4 flex-wrap">
            {item?.auctionDate ? (
              <span className="font-bold text-sm">
                {formattedDate(item?.auctionDate)}
              </span>
            ) : null}

            {item?.assetCategory ? (
              <span className="font-bold text-sm">
                | &nbsp;&nbsp;{item?.assetCategory}{" "}
              </span>
            ) : null}
          </div>
          <ActionButton
            text="View Auction"
            customClass="lg:w-fit w-full"
            onclick={() => handleClick(item)}
          />
        </div>
      </div>
    </>
  );
};

export default AuctionCard;
