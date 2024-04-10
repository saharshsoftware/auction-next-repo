import NotFound from "@/app/not-found";
import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import { getAuctionData } from "@/server/actions";
import { getDataFromQueryParams } from "@/shared/Utilies";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Find auction with amazing deals",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { category, bank, price, location, page } = getDataFromQueryParams(
    searchParams?.q ? searchParams?.q.toString() : ""
  );
  const { sendResponse: data, meta } = await getAuctionData({
    category: category,
    bankName: bank,
    reservePrice: price,
    location: location,
    page: page
  }) as unknown as any;
  // console.log(data, "data")
  if (data) {
    return (
      <>
        <ShowAuctionList searchParams={searchParams} responseData={data} meta={meta}/>
      </>
    );
  }
  if (data == undefined) {
    return NotFound(); // Handle case where blog data is not found
  }
}
