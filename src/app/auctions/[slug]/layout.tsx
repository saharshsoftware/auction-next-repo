import { Suspense } from "react";

export default function AuctionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return <Suspense>{children}</Suspense>;
}
