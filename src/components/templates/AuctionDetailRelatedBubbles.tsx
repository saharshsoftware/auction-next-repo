import { STRING_DATA } from "@/shared/Constants";
import React from "react";
import BubbleButton from "../atoms/BubbleButton";
import { IBanks, ILocations } from "@/types";

const AuctionDetailRelatedBubbles = (props: {
  auctionDetailData: any;
  auctionDetailStoredata: any;
  bankData: IBanks | null;
  locationData: ILocations | null;
}) => {
  const { auctionDetailStoredata, bankData, locationData } = props;
  const renderer = () => {
    return (
      <>
        {auctionDetailStoredata?.city &&
          auctionDetailStoredata?.bankName &&
          bankData?.slug &&
          locationData?.slug && (
            <BubbleButton
              path={`/${STRING_DATA.LOCATIONS?.toLowerCase()}/${
                locationData?.slug
              }/${STRING_DATA.BANKS?.toLowerCase()}/${bankData?.slug}`}
              label={`More ${auctionDetailStoredata?.bankName} Auctions Properties in ${auctionDetailStoredata?.city}`}
            />
          )}
        <div className="md:hidden border-[0.5px] border-gray-200  w-full" />
        {auctionDetailStoredata?.bankName && bankData?.slug && (
          <BubbleButton
            path={`/${STRING_DATA.BANKS?.toLowerCase()}/${bankData?.slug}`}
            label={`More ${auctionDetailStoredata?.bankName} Auctions Properties `}
          />
        )}
        <div className="md:hidden border-[0.5px] border-gray-200  w-full" />
        {auctionDetailStoredata?.city && locationData?.slug && (
          <BubbleButton
            path={`/${STRING_DATA.LOCATIONS?.toLowerCase()}/${
              locationData?.slug
            }`}
            label={`More Auction Properties in ${auctionDetailStoredata?.city}`}
          />
        )}
      </>
    );
  };
  return (
    <>
      <div className=" flex flex-row flex-wrap items-center justify-start md:gap-4 my-4">
        {renderer()}
      </div>
    </>
  );
};

export default AuctionDetailRelatedBubbles;
