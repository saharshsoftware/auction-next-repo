import CustomReactCarousel from "@/components/atoms/CustomReactCarousel";
import HeroSection from "@/components/atoms/HeroSection";

import { fetchBanks, fetchLocation } from "@/server/actions";
import {
  fetchAlertsServer,
  fetchFavoriteListServer,
  fetchSavedSearchServer,
  getAssetType,
  getCarouselData,
  getCategoryBoxCollection,
} from "@/server/actions/auction";
import { sanitizeReactSelectOptions } from "@/shared/Utilies";
import {
  IAlert,
  IAssetType,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { AlertsSection } from "@/components/atoms/AlertsSection";
import { SavedSearchesSection } from "@/components/atoms/SavedSearchesSection";
import { WishlistSection } from "@/components/atoms/WishlistSection";
import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";
import { AuctionSmarterSection } from "@/components/atoms/AuctionSmarterSection";
import PartnerAndHelpSection from "@/components/atoms/PartnerAndHelpSection";
import ForceRefreshOnMount from "@/components/atoms/ForceRefreshOnMount";
import LandingPageSection from "@/components/molecules/LandingPageSections";
import DownloadBanner from "@/components/molecules/DownloadSection";

export const revalidate = 0;
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

const CategoryCollection = dynamic(
  () => import("@/components/molecules/CategoryCollection"),
  { ssr: false }
);
const BankCollection = dynamic(
  () => import("@/components/molecules/BankCollection"),
  { ssr: false }
);
const AssetsCollection = dynamic(
  () => import("@/components/molecules/AssetsCollection"),
  { ssr: false }
);
const LocationCollection = dynamic(
  () => import("@/components/molecules/LocationCollection"),
  { ssr: false }
);
const CommonCollectionComp = dynamic(
  () => import("@/components/molecules/CommonCollectionComp"),
  { ssr: false }
);

const getComponent = (componentName: string) => {
  switch (componentName) {
    case "CategoryCollection":
      return CategoryCollection;
    case "BankCollection":
      return BankCollection;
    case "AssetsCollection":
      return AssetsCollection;
    case "LocationCollection":
      return LocationCollection;
    default:
      return CommonCollectionComp;
  }
};

export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value ?? "";
  const isAuthenticated = !!token;

  const [
    assetsTypeOptions,
    categoryOptions,
    bankOptions,
    locationOptions,
    carouselResponse,
  ] = (await Promise.all([
    getAssetType(),
    getCategoryBoxCollection(),
    fetchBanks(),
    fetchLocation(),
    getCarouselData(),
  ])) as unknown as [
      IAssetType[],
      ICategoryCollection[],
      IBanks[],
      ILocations[],
      any[]
    ];

  const renderHomeCollection = () => {
    if (carouselResponse) {
      return (
        <section className="md:my-auto mt-12">
          {carouselResponse?.map(
            (
              item: {
                componentName: string;
                name: string;
                collectionData: any[];
                description?: string;
                title?: string;
                subTitle?: string;
                strapiAPIQuery?: string;
              },
              index: number
            ) => {
              const ItemComponent = getComponent(item?.componentName) as any;
              return (
                <div
                  key={index}
                  className={`${index % 2 === 0 ? "bg-odd-color" : "bg-even-color"
                    }`}
                >
                  <CustomReactCarousel
                    desc={item?.description ?? ""}
                    ItemComponent={item?.componentName}
                    title={item?.title ?? ""}
                    subTitle={item?.subTitle ?? ""}
                  >
                    {item?.collectionData?.map(
                      (subItem: any, index: number) => (
                        <ItemComponent
                          key={index}
                          item={subItem}
                          fetchQuery={item?.strapiAPIQuery}
                        />
                      )
                    )}
                  </CustomReactCarousel>
                </div>
              );
            }
          )}
        </section>
      );
    }
    return "";
  };

  return (
    <>
      <ForceRefreshOnMount />
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

        <DownloadBanner />
        <LandingPageSection
          isAuthenticated={isAuthenticated}
          locationOptions={locationOptions}
          categoryOptions={categoryOptions}
          assetsTypeOptions={assetsTypeOptions}
          bankOptions={bankOptions}
        />
        {/* Home Collection Sections - Already has alternating colors */}
        {renderHomeCollection()}
      </main>
    </>
  );
}
