"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { formatPrice, formattedDate, getSharedAuctionUrl } from "../../shared/Utilies";
import { IAuction } from "@/types";
import { WhatsappShareWithIcon } from "./SocialIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

interface IAuctionCard {
  item?: IAuction;
  handleClick?: (data: any) => void;
}

const getTabIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2rem"
      height="1.2rem"
      viewBox="0 0 16 16"
    >
      <path
        fill="white"
        d="M3 1v12h12V1zm11 11H4V2h10zM2 14V3.5l-1-1V15h12.5l-1-1z"
      />
      <path fill="white" d="M5.5 4L8 6.5l-3 3L6.5 11l3-3l2.5 2.5V4z" />
    </svg>
  );
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
        <div className="flex gap-4 justify-between items-start ">
          <div className="flex flex-col gap-2 items-start justify-start">
            <span className={auctionLabelClass()}>Reserve price</span>
            <span className="custom-prize-color font-bold text-2xl">
              {formatPrice(item?.reservePrice)}
            </span>
            <span className="border border-blue-300 bg-blue-100 text-sm rounded-full px-2 py-1 font-semibold">
              Estimated Market Value {formatPrice(item?.estimatedMarketPrice)}
            </span>
          </div>
          <div>{WhatsappShareWithIcon({ url: sharedUrl })}</div>
        </div>
        <p className="flex-1 line-clamp-4">
          <div
            className={`flex gap-2 items-center justify-start ${auctionLabelClass()}`}
          >
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
          <Link
            href={`${ROUTE_CONSTANTS.AUCTION_DETAIL}/${item?.slug}`}
            target="_blank"
            prefetch={false}
          >
            <ActionButton
              text="View Auction"
              customClass="lg:w-fit w-full"
              icon={getTabIcon()}
              // onclick={() => handleClick(item)}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default AuctionCard;
