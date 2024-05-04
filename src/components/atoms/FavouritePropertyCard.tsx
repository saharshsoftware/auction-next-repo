"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { formatPrice, formattedDate, getSharedAuctionUrl } from "../../shared/Utilies";
import { IFavouriteListProperty, IProperty } from "@/types";
import { WhatsappShareWithIcon } from "./SocialIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface IFavouritePropertyCardComp {
  item?: IFavouriteListProperty;
  propertyData: IProperty;
  handleClick?: (data: any) => void;
}

const auctionLabelClass = () => "text-sm text-gray-400 font-bold";

const FavouritePropertyCard: React.FC<IFavouritePropertyCardComp> = (props) => {
  const { item, propertyData, handleClick = () => {} } = props;
  const sharedUrl = getSharedAuctionUrl(item);
  return (
    <>
      <div className="flex flex-col gap-4 p-4 border rounded shadow w-full min-h-40">
        <div className="flex flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class">{propertyData?.title} </h2>
        </div>
        <div className="flex gap-4 justify-between items-start ">
          <div className="flex flex-col gap-2 items-start justify-start">
            <span className={auctionLabelClass()}>Reserve price</span>
            <span className="custom-prize-color font-bold text-2xl">
              {formatPrice(propertyData?.reservePrice)}
            </span>
          </div>
          <div>{WhatsappShareWithIcon({ url: sharedUrl })}</div>
        </div>
        <p className="flex-1 line-clamp-4">{propertyData?.bankName}</p>
        <p className="flex-1 line-clamp-4">{propertyData?.location}</p>
        <div className="flex lg:flex-row flex-col gap-4 justify-between items-start">
          <div className="flex items-center justify-start gap-4 flex-wrap">
            {propertyData?.auctionDate ? (
              <span className="font-bold text-sm">
                {formattedDate(propertyData?.auctionDate)}
              </span>
            ) : null}

            {propertyData?.assetCategory ? (
              <span className="font-bold text-sm">
                | &nbsp;&nbsp;{propertyData?.assetCategory}{" "}
              </span>
            ) : null}
          </div>
          <ActionButton
            text="Remove"
            icon={<FontAwesomeIcon icon={faX} />}
            customClass="lg:w-fit w-full"
            onclick={() => handleClick(item)}
            isDeleteButton={true}
          />
        </div>
      </div>
    </>
  );
};

export default FavouritePropertyCard;
