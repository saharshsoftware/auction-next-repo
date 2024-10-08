import ShowAuctionList from "@/components/molecules/ShowAuctionList";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results | eauctiondekho",
  description:
    "Explore tailored auction listings based on your search criteria. Find the best properties, vehicles, and more across India. Update your search to refine results and discover ideal auction deals on eauctiondekho.",
  keywords: [
    "auction search",
    "properties search",
    "vehicles auction",
    "machinery auction",
    "India auction",
    "eauctiondekho",
  ],
  robots: "noindex, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search`,
  },

  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search`,
    title: "Custom Search Results | eauctiondekho",
    description:
      "Find auctions that match your needs with eauctiondekho. From residential properties to commercial equipment, our search helps you locate the best auctions tailored to your preferences.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search-meta-image.jpg`,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search`,
    card: "summary_large_image",
    title: "Explore Search Results on eauctiondekho",
    description:
      "Use eauctiondekho to tailor your auction search across various categories and locations. Refine and browse through listings to capture the best deals available in India.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/search-twitter-meta-image.jpg`,
      },
    ],
  },
};
export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <section>
        <ShowAuctionList />
      </section>
    </>
  );
}
