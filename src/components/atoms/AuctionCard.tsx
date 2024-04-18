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
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0,0,256,256"
      width="1.2rem"
      height="1.2rem"
    >
      <g
        fill="#ffffff"
        fill-rule="nonzero"
        stroke="none"
        stroke-width="1"
        stroke-linecap="butt"
        stroke-linejoin="miter"
        stroke-miterlimit="10"
        stroke-dasharray=""
        stroke-dashoffset="0"
        font-family="none"
        font-weight="none"
        font-size="none"
        text-anchor="none"
      >
        <g transform="scale(5.33333,5.33333)">
          <path d="M40.96094,4.98047c-0.07387,0.00243 -0.14755,0.00895 -0.2207,0.01953h-12.74023c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h8.17188l-13.58594,13.58594c-0.52248,0.50163 -0.73295,1.24653 -0.55024,1.94742c0.18271,0.70088 0.73006,1.24823 1.43094,1.43094c0.70088,0.18271 1.44578,-0.02776 1.94742,-0.55024l13.58594,-13.58594v8.17188c-0.0102,0.72127 0.36875,1.39216 0.99175,1.75578c0.623,0.36361 1.39351,0.36361 2.01651,0c0.623,-0.36361 1.00195,-1.0345 0.99175,-1.75578v-12.75391c0.0781,-0.58158 -0.10312,-1.16812 -0.49567,-1.60429c-0.39255,-0.43617 -0.95683,-0.67796 -1.5434,-0.66133zM12.5,8c-4.11731,0 -7.5,3.38269 -7.5,7.5v20c0,4.11731 3.38269,7.5 7.5,7.5h20c4.11731,0 7.5,-3.38269 7.5,-7.5v-9.5c0.0102,-0.72127 -0.36875,-1.39216 -0.99175,-1.75578c-0.623,-0.36361 -1.39351,-0.36361 -2.01651,0c-0.623,0.36361 -1.00195,1.0345 -0.99175,1.75578v9.5c0,1.94669 -1.55331,3.5 -3.5,3.5h-20c-1.94669,0 -3.5,-1.55331 -3.5,-3.5v-20c0,-1.94669 1.55331,-3.5 3.5,-3.5h9.5c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175z"></path>
        </g>
      </g>
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
            href={`${ROUTE_CONSTANTS.AUCTION_SLASH}/${item?.slug}`}
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
