import AllCities from "@/components/templates/AllCities";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Cities and States | Find Auctions Across India - eauctiondekho",
  description:
    "Browse auctions in all cities and states across India with eauctiondekho. Whether you are looking for property, vehicles, or machinery, find auctions near you or across the country.",
  keywords: [
    "city auctions",
    "state auctions",
    "India auctions",
    "local auctions",
    "nationwide auctions",
    "property auctions",
    "vehicle auctions",
    "machinery auctions",
    "eauctiondekho",
  ],
  robots: "index, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities-states`,
  },
  manifest: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities-states`,
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities-states`,
    title:
      "Explore Auctions in Every City and State Across India | eauctiondekho",
    description:
      "Looking for auctions in your city or planning to explore state-wide auction opportunities? Discover the widest selection of auctions across all major cities and states at eauctiondekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities-states-meta-image.jpg`,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities-states`,
    card: "summary_large_image",
    title:
      "All Cities and States | Discover Auctions Across India - eauctiondekho",
    description:
      "From local city auctions to expansive state-wide auctions, find your perfect investment opportunity in properties, vehicles, and more with eauctiondekho. Explore now!",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities-states-twitter-meta-image.jpg`,
      },
    ],
  },
};

export default function Page() {
  return <section>
    <AllCities />
  </section>;
}
