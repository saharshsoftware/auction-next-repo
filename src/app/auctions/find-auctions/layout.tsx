import AuctionLayoutClient from "@/components/layouts/AuctionLayoutClient";
import { Suspense } from "react";

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
