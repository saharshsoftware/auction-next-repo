import AuctionLayoutClient from "@/components/layouts/AuctionLayoutClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { alternates: { canonical: "/search" } };

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <AuctionLayoutClient />
      {children} {/* Ensure the page content is rendered */}
    </Suspense>
  );
}
