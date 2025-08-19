import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | eauctiondekho",
  description: "Find answers to common questions about property auctions, EMD, bidding process, and more. Get help with auction-related queries on eauctiondekho.",
  keywords: [
    "auction FAQ",
    "property auction questions",
    "EMD questions",
    "bidding FAQ",
    "auction process help",
    "property auction guide",
    "eauctiondekho FAQ"
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/faq`,
    title: "FAQ - Frequently Asked Questions | eauctiondekho",
    description: "Get answers to common questions about property auctions, EMD, bidding process, and more. Comprehensive FAQ section for auction participants.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/faq`,
    card: "summary_large_image",
    title: "FAQ - Frequently Asked Questions on eauctiondekho",
    description: "Find answers to common auction questions, learn about EMD, bidding process, and property auction procedures. Your complete guide to auction FAQs.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
      },
    ],
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
