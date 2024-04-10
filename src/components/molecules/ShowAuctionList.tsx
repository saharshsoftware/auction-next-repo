import React from "react";
import AuctionCard from "../atoms/AuctionCard";
import { redirect } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { IAuction } from "@/types";
import { getDataFromQueryParams, sanitizedAuctionData, setDataInQueryParams } from "@/shared/Utilies";
import { SAMPLE_PLOT2 } from "@/shared/Constants";
import NoDataImage from "../ui/NoDataImage";
import PaginationComp from "../atoms/PaginationComp";
import { revalidatePath } from "next/cache";

const ShowAuctionList = ({
  searchParams,
  responseData,
  meta
}: {
  searchParams: any;
  responseData: IAuction[];
  meta: any;
}) => {

  const handlePageChange = async (page: number)=> {
    "use server"
    console.log(page, "pagepagination")
      // const { category, bank, price, location } = getDataFromQueryParams(
      //   searchParams?.q ? searchParams?.q.toString() : ""
      // );
      // const updateParams = {
      //   category,
      //   bank,
      //   price,
      //   location,
      //   page
      // };
      // console.log(updateParams, "updateParams");
      // const data = setDataInQueryParams(updateParams);
      // const path = `${ROUTE_CONSTANTS.AUCTION}?q=${data}`;
      // revalidatePath(path, "page");
  }

  const handleClick = async (data: any) => {
    "use server";
    redirect(
      ROUTE_CONSTANTS.AUCTION_DETAIL + "/" + data?.id + "?q=" + searchParams?.q
    );
  };
  // const auctionData = sanitizedAuctionData(SAMPLE_PLOT2) as unknown as IAuction;

  if (responseData?.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-[70vh]">
        {/* <p>No Result found</p>
        <span>(Try using another filter)</span> */}
        <NoDataImage />
      </div>
    );
  }

  // console.log(meta, "meta");
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {responseData.map((item: IAuction, index: number) => {
          return (
            <div className="w-full" key={index}>
              <AuctionCard item={item} handleClick={handleClick} />
            </div>
          );
        })}
      </div>
      <PaginationComp totalPage={meta?.total} onChangePage={handlePageChange} />
    </>
  );
};

export default ShowAuctionList;
