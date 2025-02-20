"use client";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import React, { useEffect, useState } from "react";
import BubbleButton from "../atoms/BubbleButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IBanks, ILocations } from "@/types";
import { fetchBanksClient } from "@/services/bank";
import { fetchLocationClient } from "@/services/location";

const AuctionDetailRelatedBubbles = (props: {
  cityName: string;
  bankName: string;
}) => {
  const { cityName, bankName } = props;

  const [bankData, setBankData] = useState<IBanks | null>(null);
  const [locationData, setLocationData] = useState<ILocations | null>(null);

  const { data: bankOptions, isLoading: isLoadingBank } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanksClient()) as unknown as IBanks[];

      return res ?? [];
    },
  });

  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];

      return res ?? [];
    },
  });

  useEffect(() => {
    if (
      bankOptions &&
      locationOptions &&
      bankOptions?.length > 0 &&
      locationOptions?.length > 0
    ) {
      const resultBankData = bankOptions.find(
        (data: any) => data.name === bankName
      ) as IBanks;
      const resultLocationData = locationOptions.find(
        (data: any) => data.name === cityName
      ) as ILocations;
      console.log("resultBankData, resultLocationData", {
        resultBankData,
        resultLocationData,
      });
      setBankData(resultBankData);
      setLocationData(resultLocationData);
    }
  }, [bankName, cityName, bankOptions, locationOptions]);
  const renderer = () => {
    return (
      <>
        {cityName && bankName && bankData?.slug && locationData?.slug && (
          <BubbleButton
            path={`/${STRING_DATA.LOCATIONS?.toLowerCase()}/${
              locationData?.slug
            }/${STRING_DATA.BANKS?.toLowerCase()}/${bankData?.slug}`}
            label={`More ${bankName} Auctions Properties in ${cityName}`}
          />
        )}
        {bankName && bankData?.slug && (
          <BubbleButton
            path={`/${STRING_DATA.BANKS?.toLowerCase()}/${bankData?.slug}`}
            label={`More ${bankName} Auctions Properties `}
          />
        )}
        {cityName && locationData?.slug && (
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
