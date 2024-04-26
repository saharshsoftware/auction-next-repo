import AllCategories from "@/components/templates/AllCategories";
import React from "react";

import type { Metadata } from "next";
import { getCategoryBoxCollection } from "@/server/actions";
import { ICategoryCollection } from "@/types";
import { PAGE_REVALIDATE_TIME } from "@/shared/Constants";

export const metadata: Metadata = {
  title:
    "Explore Auctions for Vehicles, Properties, Machinery & More | eauctiondekho",
  description:
    "Discover auctions for a wide array of assets including vehicles, flats, plots, industrial lands, commercial offices, and more at eauctiondekho. Start your search today to secure valuable assets across India.",
  keywords: [
    "vehicle auctions",
    "property auctions",
    "flat auctions",
    "plot auctions",
    "machinery auctions",
    "gold auctions",
    "industrial land auctions",
    "commercial office auctions",
    "residential unit auctions",
    "land auctions",
    "godown auctions",
    "non-agricultural land auctions",
    "India",
  ],
  robots: "index, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories`,
  },
  manifest: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories`,

  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories`,
    title:
      "Explore Auctions | eauctiondekho - Vehicles, Properties, Plots, and More",
    description:
      "Find your next investment with eauctiondekho. Browse auctions for vehicles, properties, industrial lands, commercial spaces, and other valuable assets. Dive into our extensive listing and bid today.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories-meta-image.jpg`,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories`,
    card: "summary_large_image",
    title:
      "Explore Auctions for Vehicles, Properties, Machinery & More | eauctiondekho",
    description:
      "Discover and bid on vehicles, residential and commercial properties, plots, and various other assets at eauctiondekho. Your gateway to finding top auction deals in India.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories-twitter-meta-image.jpg`,
      },
    ],
  },
};

export default async function Page() {
  const data = await getCategoryBoxCollection() as ICategoryCollection[];
  return (
    <>
      <section>
        <AllCategories data={data}/>
      </section>
    </>
  );
}

export const revalidate = PAGE_REVALIDATE_TIME;