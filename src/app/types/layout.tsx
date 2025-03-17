import FallbackLoading from "@/components/atoms/FallbackLoading";
import { lazy, Suspense } from "react";

const FindAuction = lazy(() => import("@/components/molecules/FindAuction"));
const RecentData = lazy(() => import("@/components/molecules/RecentData"));

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
