import { getAuctionDetail } from "@/server/actions";
import { Metadata } from "next";
import { IAuction } from "@/types";
import NotFound from "@/app/not-found";
import AuctionDetail from "@/components/templates/AuctionDetail";

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
  const { slug } = params;
  const auctionDetail = (await getAuctionDetail({ slug })) as IAuction;

  if (auctionDetail) {
    return <AuctionDetail auctionDetail={auctionDetail} />;
  }
  if (auctionDetail == undefined) {
    return NotFound(); // Handle case where blog data is not found
  }
}
