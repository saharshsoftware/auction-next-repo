import { Metadata } from "next";
import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";
import HelpPageTemplate from "@/components/templates/HelpPageTemplate";
export const metadata: Metadata = {
  title: "Help & Support - Manage Your Auction Preferences | eAuctionDekho",
  description:
    "Learn about auction features including saved searches, property alerts, and wishlist collections. Discover how to manage your auction preferences on eAuctionDekho.",
  keywords: [
    "auction help",
    "saved searches",
    "property alerts",
    "wishlist collections",
    "auction dashboard",
    "auction support",
    "eauctiondekho help",
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/help`,
    title: "Help & Support - Manage Your Auction Preferences | eAuctionDekho",
    description:
      "Access your personalized auction dashboard. Manage saved searches, property alerts, and wishlist collections on eAuctionDekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/help`,
    card: "summary_large_image",
    title: "Help & Support - Manage Your Auction Preferences | eAuctionDekho",
    description:
      "Access your personalized auction dashboard. Manage saved searches, property alerts, and wishlist collections on eAuctionDekho.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
      },
    ],
  },
};

export default async function HelpPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value ?? "";
  const isAuthenticated = !!token;

  return (
    <HelpPageTemplate
      isAuthenticated={isAuthenticated}
    />
  );
}
