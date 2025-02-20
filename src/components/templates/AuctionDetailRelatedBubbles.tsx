"use client";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import React, { useEffect, useState } from "react";
import BubbleButton from "../atoms/BubbleButton";
import { useQueryClient } from "@tanstack/react-query";
import { IBanks, ILocations } from "@/types";

const AuctionDetailRelatedBubbles = (props: {
  cityName: string;
  bankName: string;
}) => {
  const { cityName, bankName } = props;
  const queryClient = useQueryClient();
  const cachedData: any = queryClient.getQueryData([REACT_QUERY.AUCTION_BANKS]);
  const [bankData, setBankData] = useState<IBanks | null>(null);
  const [locationData, setLocationData] = useState<ILocations | null>(null);
  const cachedLocationData: any = queryClient.getQueryData([
    REACT_QUERY.AUCTION_LOCATION,
  ]);

  useEffect(() => {
    if (cachedData?.length > 0 && cachedLocationData?.length > 0) {
      const resultBankData = cachedData.find(
        (data: any) => data.name === bankName
      );
      const resultLocationData = cachedLocationData.find(
        (data: any) => data.name === cityName
      );
      setBankData(resultBankData);
      setLocationData(resultLocationData);
    }
  }, [bankName, cachedData, cachedLocationData, cityName]);
  const renderer = () => {
    return (
      <>
        {cityName && bankName && (
          <BubbleButton
            path={`/${STRING_DATA.LOCATIONS?.toLowerCase()}/${
              locationData?.slug
            }/${STRING_DATA.BANKS?.toLowerCase()}/${bankData?.slug}`}
            label={`More ${bankName} Auctions Properties in ${cityName}`}
          />
        )}
        {bankName && (
          <BubbleButton
            path={`/${STRING_DATA.BANKS?.toLowerCase()}/${bankData?.slug}`}
            label={`More ${bankName} Auctions Properties `}
          />
        )}
        {cityName && (
          <BubbleButton
            path={`/${STRING_DATA.LOCATIONS?.toLowerCase()}/${
              locationData?.slug
            }`}
            label={`More Auction Properties in ${cityName}`}
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
