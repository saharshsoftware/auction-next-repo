"use client";
import React from "react";
import ActionButton from "./ActionButton";
import {
  formatPrice,
  formattedDate,
  getSharedAuctionUrl,
} from "../../shared/Utilies";
import { IAuction } from "@/types";
import { WhatsappShareWithIcon } from "./SocialIcons";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import NewTabSvg from "../svgIcons/NewTabSvg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface IAuctionCard {
  item?: IAuction;
  handleClick?: (data: any) => void;
  handleRemove?: (data: any) => void;
  showRemoveButton?: boolean;
}

const auctionLabelClass = () => "text-sm text-gray-400 font-bold";

const AuctionCard: React.FC<IAuctionCard> = (props) => {
  const {
    item,
    handleClick = () => {},
    handleRemove = () => {},
    showRemoveButton,
  } = props;

  const sharedUrl = getSharedAuctionUrl(item);

  // Separate functions to handle the conditions
  const renderReservePrice = () => {
    if (item?.assetCategory !== "Gold Auctions") {
      return (
        <>
          <span className={auctionLabelClass()}>Reserve price</span>
          <span className="custom-prize-color font-bold text-2xl">
            {formatPrice(item?.reservePrice)}
          </span>
        </>
      );
    }
    return null;
  };

  const renderEstimatedMarketValue = () => {
    if (
      item?.assetCategory !== "Vehicle Auctions" &&
      item?.assetCategory !== "Gold Auctions"
    ) {
      return (
        <span
          className="border border-blue-300 bg-blue-100 text-sm rounded-full px-2 py-1 font-semibold"
          style={{ width: "max-content" }}
        >
          Estimated Market Value {formatPrice(item?.estimatedMarketPrice)}
        </span>
      );
    }
    return null;
  };

  const renderAuctionDetails = () => {
    return (
      <div className="flex items-center justify-start gap-4 flex-wrap">
        {item?.auctionDate && (
          <span className="font-bold text-xs">
            {formattedDate(item?.auctionDate)}
          </span>
        )}
        {item?.assetCategory && (
          <span className="font-bold text-xs">
            | &nbsp;&nbsp;{item?.assetCategory}
          </span>
        )}
        {item?.assetType && (
          <span className="font-bold text-xs">
            | &nbsp;&nbsp;{item?.assetType}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 border rounded shadow w-full min-h-40">
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class">{item?.title}</h2>
        </div>
        <div className={`flex gap-4 justify-between items-start flex-wrap`}>
          <div className="flex flex-col gap-2 items-start justify-start">
            {renderReservePrice()}
            {renderEstimatedMarketValue()}
          </div>
          <div className="border border-green-500 rounded-lg px-2 py-1">
            {WhatsappShareWithIcon({ url: sharedUrl })}
          </div>
        </div>
        <div className="flex-1 line-clamp-4">
          <div
            className={`flex gap-2 items-center justify-start ${auctionLabelClass()}`}
          >
            <span>Seller - </span>
            <div>{item?.bankName}</div>
          </div>
        </div>
        <p className="flex-1 line-clamp-4">{item?.location}</p>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          {renderAuctionDetails()}
        </div>
        <div className="flex items-center justify-end gap-4 flex-wrap">
          <Link
            href={`${ROUTE_CONSTANTS.AUCTION_SLASH}/${item?.slug}`}
            target="_blank"
            prefetch={false}
            className="min-w-fit"
          >
            <ActionButton
              text="View Auction"
              customClass="w-full"
              icon={<NewTabSvg />}
            />
          </Link>
          {showRemoveButton ? (
            <ActionButton
              text="Remove"
              icon={<FontAwesomeIcon icon={faX} />}
              customClass="w-fit"
              onclick={() => handleRemove(item)}
              isDeleteButton={true}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AuctionCard;
