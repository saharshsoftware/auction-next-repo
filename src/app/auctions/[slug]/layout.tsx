import FallbackLoading from "@/components/atoms/FallbackLoading";
import FindAuction from "@/components/molecules/FindAuction";
import RecentData from "@/components/molecules/RecentData";
import AuctionDetailRelatedBubbles from "@/components/templates/AuctionDetailRelatedBubbles";
import { headers } from "next/headers";
import { Suspense } from "react";

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
