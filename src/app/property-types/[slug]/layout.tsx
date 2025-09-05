import { PAGE_REVALIDATE_TIME_FOR_AUCTION_LIST } from "@/shared/Constants";
import { Suspense } from "react";

export const revalidate = PAGE_REVALIDATE_TIME_FOR_AUCTION_LIST;

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      {children} {/* Ensure the page content is rendered */}
    </Suspense>
  );
}
