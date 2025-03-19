import React, { lazy } from "react";

const ShowAuctionList = lazy(
  () => import("@/components/molecules/ShowAuctionList")
);
export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string; slugcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("(INFO) :: params", params, searchParams);
  return (
    <>
      <ShowAuctionList />
    </>
  );
}
