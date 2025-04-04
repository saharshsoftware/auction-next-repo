import AllBanks from "@/components/templates/AllBanks";
import React from "react";
import type { Metadata } from "next";
import { fetchBanks } from "@/server/actions";
import { groupAndSortBanks } from "@/shared/Utilies";
import { IBanks } from "@/types";

export const metadata: Metadata = {
  title: "All Indian Banks | Auction Listings - eauctiondekho",
  description:
    "Explore auction listings from all major Indian banks at eauctiondekho. Access comprehensive auction details from banks across India to find the best investment opportunities.",
  keywords: [
    "Indian banks",
    "bank auctions",
    "auction listings",
    "bank auction details",
    "eauctiondekho",
    "investment opportunities",
    "property auctions",
    "vehicle auctions",
    "machinery auctions",
  ],
  robots: "index, follow",

  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks`,
    title: "Explore Auctions from All Top Indian Banks | eauctiondekho",
    description:
      "Connect with India's top banks for exclusive auction deals on properties, vehicles, and more. Discover reliable and secure investment options at eauctiondekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks-meta-image.jpg`,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks`,
    card: "summary_large_image",
    title: "All Indian Banks | Explore Auction Listings - eauctiondekho",
    description:
      "Discover and participate in bank auctions across India. Browse updated listings from all major Indian banks exclusively at eauctiondekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/banks-twitter-meta-image.jpg`,
      },
    ],
  },
};

export default async function Page() {
  const data = (await fetchBanks()) as unknown as IBanks[];
  return (
    <section>
      <AllBanks data={groupAndSortBanks(data)} />
    </section>
  );
}
