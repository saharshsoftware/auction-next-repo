import React from "react";
import { OurServices } from "@/components/templates/OurServices";
import ServiceJsonLd from "@/components/atoms/ServiceJsonLd";
import { BANK_AUCTION_SERVICES } from "@/shared/Constants";
import { Metadata } from "next";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title:
    "Bank Auction Support Services | e-auctiondekho",
  description:
    "Get expert bank auction support – due diligence, loan approval help, guided property visits, and end-to-end buyer assistance from e-auctiondekho.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
    title:
      "Bank Auction Support Services | e-auctiondekho",
    description:
      "Expert bank auction services – due diligence, loan approval assistance, guided property visits, and complete buyer support by e-auctiondekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
    card: "summary_large_image",
    title:
      "Bank Auction Support Services | e-auctiondekho",
    description:
      "Expert bank auction services – due diligence, loan approval assistance, guided property visits, and complete buyer support by e-auctiondekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
      },
    ],
  },
};

export default async function Page() {
  return (
    <>
      <ServiceJsonLd services={BANK_AUCTION_SERVICES} />
      <OurServices />
    </>
  );
}
