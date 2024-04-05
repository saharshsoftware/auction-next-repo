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
  const { category, bank, price } = getDataFromQueryParams(
    searchParams?.q ? searchParams?.q.toString() : ""
  );
  const data = await getAuctionData({
    category: category,
    bankName: bank,
    reservePrice: price,
  });
  // console.log(data, "data")
  if (data) {
    return (
      <>
        <ShowAuctionList searchParams={searchParams} responseData={data} />
      </>
    );
  }
  if (data == undefined) {
    return NotFound(); // Handle case where blog data is not found
  }
}
