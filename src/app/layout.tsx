import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/hoc/Navbar";
import AppLayout from "@/components/layouts/AppLayout";
import Providers from "@/utilies/Providers";
import NextTopLoader from "nextjs-toploader";
import GoogleScriptComponent from "@/components/atoms/GoogleScriptComponent";
import { BREADCRUMB_LIST, SITELINK_SEARCHBOX } from "@/shared/seo.constant";
import logo from "@/assets/images/logo.png";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/components/hoc/Footer"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Reduces layout shift
});

export const metadata: Metadata = {
  title:
    "Find Bank Auction Properties in India | Search Residential, Commercial, Vehicles, Gold auctions & More",
  description:
    "Find bank auction properties across India on eAuctionDekho. Find your ideal property from banks like ICICI, SBI, BOB, and more. Residential flats, plots, commercial buildings, vehicles, gold, and many more.",
  keywords: [
    "bank auction properties",
    "auction properties",
    "residential auctions",
    "commercial auctions",
    "vehicle auctions",
    "gold auctions",
    "bank repossessed properties",
    "SBI property auctions",
    "ICICI property auctions",
    "HDFC auction properties",
  ],
  robots: "index, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
    title:
      "Find Bank Auction Properties in India | Search Residential, Commercial, Vehicles, Gold auctions & More",
    description:
      "Discover the best bank auctions for properties, vehicles, and machinery in any Indian city. Explore comprehensive listings from all major Indian banks. Secure your next investment with eauctiondekho today!",
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
      "Find Bank Auction Properties in India | Search Residential, Commercial, Vehicles, Gold auctions & More",
    description:
      "Find the best deals at eauctiondekho with auctions across India for vehicles, residential flats, commercial shops, industrial plots, machinery, and gold. Your one-stop shop for bank-auctioned assets.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head>
          <script src="/js/deeplink.js" defer></script>
          <link rel="preconnect" href="https://api.eauctiondekho.com" />
          <link rel="preload" as="image" href={logo.src} type="image/svg+xml" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(BREADCRUMB_LIST),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(SITELINK_SEARCHBOX),
            }}
          />
        </head>
        <body className={inter.className}>
          <Providers>
            <div className="flex flex-col h-screen">
              <NextTopLoader
                color="#000"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              />
              <Navbar />
              <AppLayout>{children}</AppLayout>
              <Footer />
            </div>
          </Providers>
          <GoogleScriptComponent />
        </body>
      </html>
    </>
  );
}
