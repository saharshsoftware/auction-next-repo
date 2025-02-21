"use client";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import React, { useEffect, useState } from "react";
import BubbleButton from "../atoms/BubbleButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IBanks, ILocations } from "@/types";
import { fetchBanksClient } from "@/services/bank";
import { fetchLocationClient } from "@/services/location";
import { useAuctionDetailsStore } from "@/zustandStore/auctionDetails";

const AuctionDetailRelatedBubbles = () => {
  const auctionDetailStoredata =
    useAuctionDetailsStore((state) => state.auctionDetailsData) ?? null;

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
    console.log("auctionDetailStoredata", auctionDetailStoredata);
    if (
      bankOptions &&
      locationOptions &&
      bankOptions?.length > 0 &&
      locationOptions?.length > 0
    ) {
      const resultBankData = bankOptions.find(
        (data: any) => data.name === auctionDetailStoredata?.bankName
      ) as IBanks;
      const resultLocationData = locationOptions.find(
        (data: any) => data.name === auctionDetailStoredata?.city
      ) as ILocations;
      console.log("resultBankData, resultLocationData", {
        resultBankData,
        resultLocationData,
      });
      setBankData(resultBankData);
      setLocationData(resultLocationData);
    }
  }, [auctionDetailStoredata, bankOptions, locationOptions]);
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
        {auctionDetailStoredata?.bankName && bankData?.slug && (
          <BubbleButton
            path={`/${STRING_DATA.BANKS?.toLowerCase()}/${bankData?.slug}`}
            label={`More ${auctionDetailStoredata?.bankName} Auctions Properties `}
          />
        )}
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
