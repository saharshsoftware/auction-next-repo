import FallbackLoading from "@/components/atoms/FallbackLoading";
import RecentData from "@/components/molecules/RecentData";
import SkeletonAuctionPage from "@/components/skeltons/SkeletonAuctionPage";
import AuctionDetailRelatedBubbles from "@/components/templates/AuctionDetailRelatedBubbles";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { Suspense } from "react";

const FindAuction = dynamic(
  () => import("@/components/molecules/FindAuction"),
  {
    ssr: false,
    loading: () => <SkeletonAuctionPage />,
  }
);

export default function AuctionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <section>
        <FindAuction />
        <div className="common-section">
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="lg:col-span-8 col-span-full ">{children}</div>
            <div className="lg:col-span-4 col-span-full">
              <RecentData />
            </div>
          </div>
          <div className="flex justify-center">
            <AuctionDetailRelatedBubbles />
          </div>
        </div>
      </section>
    </Suspense>
  );
}
