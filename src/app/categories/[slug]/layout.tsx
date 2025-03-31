import { Suspense } from "react";

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
