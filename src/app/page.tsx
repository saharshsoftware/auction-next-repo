import HeroSection from "@/components/atoms/HeroSection";

import { fetchBanks, fetchLocation } from "@/server/actions";
import {
  fetchAssetType,
  fetchCategories,
} from "@/server/actions/auction";
import { sanitizeReactSelectOptions } from "@/shared/Utilies";
import {
  IAssetType,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { Metadata } from "next";

import DownloadBanner from "@/components/molecules/DownloadSection";
import HomeCollectionsServer from "@/components/molecules/HomeCollectionServer";
import LandingPageSectionClient from "@/components/molecules/LandingPageSectionClient";
import { getFaqData } from "@/server/actions/footer";
import FaqSection from "@/components/atoms/FaqSection";
import { IMAGES } from "@/shared/Images";
import ServicesSection from "@/components/atoms/ServicesSection";
import HomeRecommendationsClient from "@/components/molecules/HomeRecommendationsClient";
import { CACHE_TIMES } from "@/shared/Constants";

export const revalidate = CACHE_TIMES.HOUR_24  
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title:
    "Find Bank Auction Properties in India | Search Residential, Commercial, Vehicles, Gold auctions & More",
  description:
    "Find bank auction properties across India on eauctiondekho. Find your ideal property from banks like ICICI, SBI, BOB, and more. Residential flats, plots, commercial buildings, vehicles, gold, and many more.",
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



export default async function Home() {

  const [
    assetsTypeOptions,
    categoryOptions,
    bankOptions,
    locationOptions,
    faqData,
  ] = (await Promise.all([
    fetchAssetType(),
    fetchCategories(),
    fetchBanks(),
    fetchLocation(),
    getFaqData(),
  ])) as unknown as [
      IAssetType[],
      ICategoryCollection[],
      IBanks[],
      ILocations[],
      any[],
      any[]
    ];

  return (
    <>
      <main className="">
        {/* Hero Section - Keep original background */}
        <section className="">
          <HeroSection
            assetsTypeOptions={sanitizeReactSelectOptions(assetsTypeOptions)}
            categoryOptions={sanitizeReactSelectOptions(categoryOptions)}
            bankOptions={sanitizeReactSelectOptions(bankOptions)}
            locationOptions={sanitizeReactSelectOptions(locationOptions)}
          />
        </section>
        {/* User Recommendations (Authenticated) */}
        <HomeRecommendationsClient />
        
        <DownloadBanner />
        <ServicesSection />    
        <LandingPageSectionClient
          locationOptions={locationOptions}
          categoryOptions={categoryOptions}
          assetsTypeOptions={assetsTypeOptions}
          bankOptions={bankOptions}
        />   


        
        {/* Home Collection Sections */}
        <HomeCollectionsServer />

        {/* FAQ Section */}
        <FaqSection 
          faqData={faqData || []}
          maxItems={5}
          showImage={true}
          imageUrl={IMAGES.faq.src}
          imageAlt="FAQ and Help Support"
        />
        
      </main>
    </>
  );
}
