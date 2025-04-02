import { PAGE_REVALIDATE_TIME_FOR_AUCTION_DETAIL } from "@/shared/Constants";
import { Suspense } from "react";

export const revalidate = PAGE_REVALIDATE_TIME_FOR_AUCTION_DETAIL;

export default function AuctionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return <Suspense>{children}</Suspense>;
}
