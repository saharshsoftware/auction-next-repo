import AuctionCard from "@/components/atoms/AuctionCard";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import PaginationCompServer, {
  ILocalFilter,
} from "@/components/atoms/PaginationCompServer";
import TopBanks from "@/components/atoms/TopBanks";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import AuctionResults from "@/components/templates/AuctionResults";
import { getCategoryBoxCollection } from "@/server/actions";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
} from "@/server/actions/auction";
import {
  fetchBanks,
  fetchBanksBySlug,
  fetchPopularBanks,
} from "@/server/actions/banks";
import { fetchLocation, fetchLocationBySlug } from "@/server/actions/location";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  getPrimaryBankName,
  handleOgImageUrl,
  sanitizeReactSelectOptionsPage,
} from "@/shared/Utilies";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { IPaginationData } from "@/zustandStore/auctionStore";
import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { SEO_BRAND } from "@/shared/seo.constant";
import { buildCanonicalUrl } from "@/shared/Utilies";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

async function getSlugData(
  slug: string,
  slugbank: string
): Promise<{ location: ILocations; bank: IBanks }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    fetchBanksBySlug({
      slug: slugbank,
    }) as Promise<IBanks[]>,
    fetchLocationBySlug({
      slug,
    }) as Promise<ILocations[]>,
  ]);
  return {
    location: selectedLocation?.[0] as ILocations,
    bank: selectedCategory?.[0] as IBanks,
  };
}

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugbank: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugbank } = params;

  try {
    const { location: locationData, bank: bankData } = await getSlugData(
      slug,
      slugbank
    );

    const { name: nameLocation } = locationData;
    const { name, slug: primaryBankSlug, secondarySlug } = bankData;
    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );
    const primaryName = getPrimaryBankName(
      name ?? "",
      secondarySlug ?? "",
      slugbank
    );
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/locations/${slug}/banks/${primaryBankSlug}`,
      page: searchParams?.page,
    });

    return {
      title: `${primaryName} Auction Properties in ${nameLocation} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
      description: `Discover ${primaryName}'s auction properties in ${nameLocation} on eauctiondekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
      alternates: {
        canonical: canonicalUrl,
      },

      keywords: [
        `${primaryName} auction properties in ${nameLocation}`,
        `${primaryName} flat bank auctions in ${nameLocation}`,
        `${primaryName} house bank auctions in ${nameLocation}`,
        `${primaryName} vehicle bank auctions in ${nameLocation}`,
        `${primaryName} commercial property bank auctions in ${nameLocation}`,
        `Agricultural land bank auctions in ${nameLocation}`,
        `${primaryName} machinery bank auctions in ${nameLocation}`,
        `${primaryName} plot bank auctions in ${nameLocation}`,
        `${primaryName} residential unit bank auctions in ${nameLocation}`,
        `eauctiondekho ${primaryName} listings in ${nameLocation}`,
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `${primaryName} Auction Properties in ${nameLocation} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${primaryName}'s auction properties in ${nameLocation} on eauctiondekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
        images: sanitizeImageUrl,
        siteName: SEO_BRAND.SITE_NAME,
        locale: SEO_BRAND.LOCALE,
      },
      twitter: {
        site: SEO_BRAND.TWITTER_HANDLE,
        card: "summary_large_image",
        title: `${primaryName} Auction Properties in ${nameLocation} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Discover ${primaryName}'s auction properties in ${nameLocation} on eauctiondekho, featuring a diverse selection of asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory and building lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today on assets tailored to meet diverse investment needs.`,
        images: sanitizeImageUrl,
      },
    };
  } catch (error) {
    console.log("Error fetching metadata:", error);
    return {};
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string; slugbank: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugbank } = params;
  const { page = 1 } = searchParams;
  const { location: locationData, bank: bankData } = await getSlugData(
    slug,
    slugbank
  );
  // console.log(locationData, "location-slug");
  const { name, type } = locationData || {};

  console.log("filterQueryDataLOcationAndBank", slug);

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    popularBanks,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    fetchPopularBanks(),
  ]);


  // Type assertions are no longer necessary if functions return correctly typed data
  const assetsTypeOptions = sanitizeReactSelectOptionsPage(
    rawAssetTypes
  ) as IAssetType[];
  const categoryOptions = sanitizeReactSelectOptionsPage(
    rawCategories
  ) as ICategoryCollection[];
  const bankOptions = sanitizeReactSelectOptionsPage(rawBanks) as IBanks[];
  const locationOptions = sanitizeReactSelectOptionsPage(
    rawLocations
  ) as ILocations[];

  const selectionLocation = locationOptions.find(
    (item) => item.name === locationData?.name
  );

  const selectedBank = bankOptions.find((item) => item.name === bankData?.name);

  const urlFilterdata = {
    location: selectionLocation,
    bank: selectedBank,
    page: String(page) || "1",
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;
  
  const getRequiredParameters = () => {
    return {
      location: name ?? "",
      locationType: type ?? "",
      bankName: bankData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const getBreadcrumbItems = () => {
    return [
      {
        label: "City",
        href: ROUTE_CONSTANTS.CITIES,
      },
      {
        label: name || "Location",
        href: `${ROUTE_CONSTANTS.LOCATION}/${slug}`,
      },
      {
        label: "Banks",
        href: ROUTE_CONSTANTS.BANKS,
      },
      {
        label: bankData?.name || "Bank",
        href: `${ROUTE_CONSTANTS.LOCATION}/${slug}/banks/${slugbank}`,
      },
    ];
  };
  return (
    <section>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/` },
          { name: "Locations", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations` },
          { name: name || "Location", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}` },
          { name: bankData?.name || "Bank", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}/banks/${slugbank}` },
        ]}
      />
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedLocation={selectionLocation}
        selectedBank={selectedBank}
      />
      <div className="common-section">
        {/* Breadcrumb Navigation */}
        <div className="pt-4">
          <Breadcrumb
            items={getBreadcrumbItems()}
          />
        </div>
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-9 col-span-full">
            <Suspense key={page?.toString()} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`${bankData.name} Auction Properties in ${name}`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="lg:col-span-3 col-span-full">
            <TopBanks
              bankOptions={popularBanks}
              isLocationRoute={true}
              locationSlug={slug}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
