"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { formatPrice, formattedDate, getSharedAuctionUrl } from "../../shared/Utilies";
import { IAuction } from "@/types";
import { WhatsappShareWithIcon } from "./SocialIcons";

interface IAuctionCard {
  item?: IAuction;
  handleClick?: (data: any) => void;
}

const auctionLabelClass = () => "text-sm text-gray-400 font-bold";

const AuctionCard: React.FC<IAuctionCard> = (props) => {
  const { item, handleClick = () => {} } = props;
  const sharedUrl = getSharedAuctionUrl(item)
  return (
    <>
      <div className="flex flex-col gap-4 p-4 border rounded shadow w-full min-h-40">
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class ">{item?.title} </h2>
        </div>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start ">
          <div className="flex flex-col gap-2 items-start justify-start">
            <span className={auctionLabelClass()}>Reserve price</span>
            <span className="custom-prize-color font-bold text-2xl">
              {formatPrice(item?.reservePrice)}
            </span>
          </div>
          <div>
            {WhatsappShareWithIcon({url: sharedUrl})}
          </div>
        </div>
        <p className="flex-1 line-clamp-4">
          <div className={`flex gap-2 items-center justify-start ${auctionLabelClass()}`}>
            <span>Seller - </span>
            <div>{item?.bankName}</div>
          </div>
        </p>
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
