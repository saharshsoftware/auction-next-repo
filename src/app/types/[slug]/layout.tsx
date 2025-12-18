import { CACHE_TIMES } from "@/shared/Constants";
import { Suspense } from "react";

export const revalidate = CACHE_TIMES.AUCTION_LIST;

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
