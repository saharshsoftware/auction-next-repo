"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faLocationDot,
  faBuilding,
  faIndianRupeeSign,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import { CustomCard } from "./CustomCard";
import { useEffect, useState } from "react";
import { getAuctionDataClient } from "@/services/auction";
import ActionButton from "./ActionButton";
import { STRING_DATA } from "@/shared/Constants";
import { type } from "os";
import useCustomParamsData from "@/hooks/useCustomParamsData";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

interface AlertProps {
  data: any;
}

export function AlertCard({ data }: AlertProps) {
  const router = useRouter();
  const [count, setCount] = useState(0);

  const { setDataInQueryParamsMethod } = useCustomParamsData();
  const fetchAuctionData = async (params: any) => {
    try {
      let res;
      console.log("(INFO):: params", params);
      res = await getAuctionDataClient(params);
      console.log("Auction data fetched (AlerdCard):", res);
      const totalCount = res?.meta?.total ?? 0;
      setCount(totalCount);
    } catch (error) {
      console.error("Error fetching auction data:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (!data) return;
    const filters = {
      category: data?.category?.name ?? "",
      bankName: data?.bank?.name ?? "",
      location: data?.location?.name ?? "",
      propertyType: data?.propertyType?.name ?? "",
      reservePrice: [data?.minPrice, data?.maxPrice],
      locationType: data?.locationType ?? "",
      page: 1,
    };
    console.log("AlertCardparamsparamsparamsSavedSearchCard", filters, data);
    fetchAuctionData(filters);
  }, [data]);
  const header = (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium capitalize">{data?.name} Property Alert</h3>
      </div>
    </>
  );

  const handleClick = (data: any) => {
    const filter = {
      page: 1,
      category: data?.category,
      price: [data?.minPrice, data?.maxPrice],
      bank: data?.bank,
      locationType: data?.locationType,
      location: data?.location,
      propertyType: data?.propertyType,
    };
    const result: any = setDataInQueryParamsMethod(filter);
    console.log("result", result, filter);
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${result}`);
  };

  return (
    <CustomCard
      header={header}
      className="!cursor-default flex flex-col h-full" // make sure h-full is applied properly
    >
      <div className="flex flex-col flex-grow h-full">
        <div className="space-y-2 flex-grow">
          {data?.category?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
              <span>{data?.category?.name}</span>
            </div>
          )}
          {data?.location?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
              <span>{data?.location?.name}</span>
            </div>
          )}
          {data?.minPrice && data?.maxPrice ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="h-4 w-4" />
              <span>
                {data.minPrice} - {data?.maxPrice}
              </span>
            </div>
          ) : null}
          {data?.bank?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faBuildingColumns} className="h-4 w-4" />
              <span>{data?.bank?.name}</span>
            </div>
          )}
        </div>
        <div className="mt-2 pt-4 border-t text-sm text-gray-500 flex items-center justify-between">
          <ActionButton text="View Details" onclick={() => handleClick(data)} />
          <div className="flex justify-end items-center text-sm text-gray-500">
            <span>
              {" "}
              {count} {count > 1 ? "properties" : "property"}
            </span>
          </div>
        </div>
      </div>
    </CustomCard>
  );
}
