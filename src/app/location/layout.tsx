import FallbackLoading from "@/components/atoms/FallbackLoading";
import FindAuction from "@/components/molecules/FindAuction";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const RecentData = dynamic(() => import("@/components/molecules/RecentData"), {
  ssr: false,
});

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <section>
        <FindAuction />
        <div className="common-section">
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="lg:col-span-8 col-span-full">{children}</div>
            <div className="lg:col-span-4 col-span-full">
              <RecentData />
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
}
