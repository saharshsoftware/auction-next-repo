import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/hoc/Footer";
import Navbar from "@/components/hoc/Navbar";
import AppLayout from "@/components/layouts/AppLayout";
import Providers from "@/utilies/Providers";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eauctiondekho | Vehicle, Property & Industrial Auctions in India",
  description:
    "Find the best deals at eauctiondekho with auctions across India for vehicles, residential flats, commercial shops, industrial plots, machinery, and gold. Your one-stop shop for bank-auctioned assets.",
  keywords: [
    "vehicle auctions",
    "property auctions",
    "flat auctions",
    "commercial property",
    "industrial plots",
    "machinery auctions",
    "gold auctions",
    "India",
  ],
  robots: "index, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
  },
  manifest: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
    title: "eauctiondekho | Vehicle, Property & Industrial Auctions in India",
    description:
      "Discover the best bank auctions for properties, vehicles, and machinery in any Indian city. Explore comprehensive listings from all major Indian banks. Secure your next investment with eauctiondekho today!",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/meta-image.jpg`,
      },
    ],
  },
  twitter: {
    site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`,
    card: "summary_large_image",
    title: "eauctiondekho | Vehicle, Property & Industrial Auctions in India",
    description:
      "Find the best deals at eauctiondekho with auctions across India for vehicles, residential flats, commercial shops, industrial plots, machinery, and gold. Your one-stop shop for bank-auctioned assets.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/twitter-meta-image.jpg`,
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
    <html lang="en">
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
      </body>
    </html>
  );
}
