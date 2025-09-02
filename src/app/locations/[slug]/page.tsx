import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import { fetchBanks, getCategoryBoxCollection } from "@/server/actions";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
} from "@/server/actions/auction";
import { fetchLocation, fetchLocationBySlug } from "@/server/actions/location";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  handleOgImageUrl,
  sanitizeReactSelectOptionsPage,
  buildCanonicalUrl,
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
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopBanks from "@/components/atoms/TopBanks";
import { fetchPopularBanks } from "@/server/actions/banks";
import AuctionResults from "@/components/templates/AuctionResults";
import { Suspense } from "react";
import { SEO_BRAND } from "@/shared/seo.constant";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";

async function getSlugData(slug: string) {
  const selectedLocation = (await fetchLocationBySlug({
    slug,
  })) as unknown as ILocations[];
  return selectedLocation?.[0];
}

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;

  try {
    const locationData = await getSlugData(slug);
    // console.log(locationData, "location-slug");
    const { name } = locationData;

    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );

    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/locations/${slug}`,
      page: searchParams?.page,
    });

    return {
      title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
      description: `Explore bank auction properties in ${name} on eauctiondekho. Find diverse asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
      alternates: { canonical: canonicalUrl },

      keywords: [
        `Bank auction property in ${name}`,
        `flat bank auctions in ${name}`,
        `house auctions in ${name}`,
        `vehicle auctions in ${name}`,
        `commercial property auctions in ${name}`,
        `agricultural land auctions in ${name}`,
        `machinery auctions in ${name}`,
        `plot auctions in ${name}`,
        `residential unit auctions in ${name}`,
        `eauctiondekho ${name} listings`,
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Explore bank auction properties in ${name} on eauctiondekho. Find diverse asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
        siteName: SEO_BRAND.SITE_NAME,
        locale: SEO_BRAND.LOCALE,
      },
      twitter: {
        site: SEO_BRAND.TWITTER_HANDLE,
        card: "summary_large_image",
        title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Explore bank auction properties in ${name} on eauctiondekho. Find diverse asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,
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
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = params;
  const { page = 1 } = searchParams;
  // Extract and sanitize search query
  const locationData = await getSlugData(slug);
  // console.log(locationData, "location-slug");
  const { name, type } = locationData;

  const filterQueryData = {
    location: {
      name,
      type,
    },
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  };

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

  const getRequiredParameters = () => {
    return {
      location: filterQueryData?.location?.name ?? "",
      locationType: filterQueryData?.location?.type ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

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

  const urlFilterdata = {
    location: selectionLocation,
    page: page ? String(page) : 1,
    price: filterQueryData?.price,
  } as ILocalFilter;

  return (
    <section>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/` },
          { name: "Locations", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations` },
          { name: name ?? "Location", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}` },
        ]}
      />
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedLocation={selectionLocation}
      />
      <div className="common-section">
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="grid-col-span-9 ">
            <Suspense key={page?.toString()} fallback={<SkeletonAuctionList />}>

              <AuctionResults
                searchParams={searchParams}
                heading={`Auction Properties in ${name}`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
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
