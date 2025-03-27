import FallbackLoading from "@/components/atoms/FallbackLoading";
import RecentData from "@/components/molecules/RecentData";
import SkeletonAuctionPage from "@/components/skeltons/SkeletonAuctionPage";
import dynamic from "next/dynamic";
import { lazy, Suspense } from "react";

const FindAuction = dynamic(
  () => import("@/components/molecules/FindAuction"),
  {
    ssr: false,
    loading: () => <SkeletonAuctionPage />,
  }
);

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      {/* <AuctionLayoutClient /> */}
      {children} {/* Ensure the page content is rendered */}
    </Suspense>
  );
}
