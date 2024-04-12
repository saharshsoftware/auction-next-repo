"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { formatPrice, formattedDate } from "../../shared/Utilies";
import { IFavouriteListProperty, IProperty } from "@/types";

interface IFavouritePropertyCardComp {
  item?: IFavouriteListProperty;
  propertyData: IProperty;
  handleClick?: (data: any) => void;
}
const FavouritePropertyCard: React.FC<IFavouritePropertyCardComp> = (props) => {
  const { item, propertyData, handleClick = () => {} } = props;
  return (
    <>
      <div className="flex flex-col gap-4 p-4 border rounded shadow w-full min-h-40">
        <div className="flex flex-col gap-4 justify-between items-start">
          <h2 className="custom-h2-class">{propertyData?.title} </h2>
          <span className="custom-prize-color font-bold text-2xl">
            {formatPrice(propertyData?.reservePrice)}
          </span>
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
