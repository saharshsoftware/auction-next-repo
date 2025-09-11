import page from "@/app/page";
import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopBanks from "@/components/atoms/TopBanks";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import { fetchBanks } from "@/server/actions";
import { fetchAssetTypes } from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollection,
  getCategoryBoxCollectionBySlug,
} from "@/server/actions/auction";
import { fetchPopularBanks } from "@/server/actions/banks";
import { fetchLocation, fetchLocationBySlug } from "@/server/actions/location";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  extractOnlyKeywords,
  getPopularDataBySortOrder,
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
import { cache, Suspense } from "react";
import { buildCanonicalUrl } from "@/shared/Utilies";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
import AuctionResults from "@/components/templates/AuctionResults";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Breadcrumb from "@/components/atoms/Breadcrumb";

// Add caching functions
const getLocationsCached = cache(async () => {
  return (await fetchLocation()) as ILocations[] | null;
});

const getCategoriesCached = cache(async () => {
  return (await fetchCategories()) as ICategoryCollection[] | null;
});


export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugcategory: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugcategory } = params;

  try {
    const [categories, locations] = await Promise.all([
      getCategoriesCached(),
      getLocationsCached(),
    ]);
    
    const locationData = locations?.find((l) => l.slug === slug);
    const categoryData = categories?.find((c) => c.slug === slugcategory);

    const { name: nameLocation } = locationData as ILocations;
    const { name: nameCategory } = categoryData as ICategoryCollection;

    let keywordsAll: string[] = [];
    if (nameCategory) {
      const allSssetTypeData = await fetchAssetTypes();
      keywordsAll = extractOnlyKeywords(allSssetTypeData, nameCategory);
    }
    const sanitizeImageUrl = await handleOgImageUrl(
      locationData?.imageURL ?? ""
    );
    console.log("Generated Image URL:", { sanitizeImageUrl }); // Debugging

    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/locations/${slug}/categories/${slugcategory}`,
      page: searchParams?.page,
    });

    return {
      title: `${nameCategory} Bank Auction Properties in ${nameLocation} | Find ${nameCategory} Auctions`,
      description: `Find ${nameCategory} bank auction properties in ${nameLocation} on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
      alternates: {
        canonical: canonicalUrl,
      },

      keywords: [
        `${nameCategory} bank auction properties`,
        ...keywordsAll.map((k) => `${k} bank auction`),
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `${nameCategory} Bank Auction Properties in ${nameLocation} | Find ${nameCategory} Auctions`,
        description: `Find ${nameCategory} bank auction properties in ${nameLocation} on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
        siteName: "eauctiondekho",
        locale: "en_IN",
      },
      twitter: {
        site: "@eauctiondekho",
        card: "summary_large_image",
        title: `${nameCategory} Bank Auction Properties in ${nameLocation} | Find ${nameCategory} Auctions`,
        description: `Find ${nameCategory} bank auction properties in ${nameLocation} on eauctiondekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
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
  params: { slug: string; slugcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugcategory } = params;
  const { page = 1 } = searchParams;

  console.log("filterQueryDataLOcationAndCategories", slug);

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    getCategoriesCached(),
    getLocationsCached(),
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

  const locationData = (rawLocations as ILocations[])?.find(
    (l) => l.slug === slug
  ) as ILocations;
  const categoryData = (rawCategories as ICategoryCollection[])?.find(
    (c) => c.slug === slugcategory
  ) as ICategoryCollection;

  const { name: nameLocation, type } = locationData;
  const { name: nameCategory } = categoryData;
  const popularBanks = getPopularDataBySortOrder(rawBanks);

  const selectionLocation = locationOptions.find(
    (item) => item.name === locationData?.name
  );

  const selectedCategory = categoryOptions.find(
    (item) => item.name === categoryData?.name
  );

  const urlFilterdata = {
    location: selectionLocation,
    category: selectedCategory,
    page: String(page) || "1",
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;

  const getRequiredParameters = () => {
    return {
      location: nameLocation ?? "",
      locationType: type ?? "",
      category: nameCategory ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const getBreadcrumbJsonLdItems = () => {
    return [
      { name: "Home", item: `/` },
      { name: "City", item: `${ROUTE_CONSTANTS.CITIES}` },
      { name: nameLocation || "Location", item: `${ROUTE_CONSTANTS.LOCATION}/${slug}` },
      { name: "Category", item: `${ROUTE_CONSTANTS.CATEGORY}` },
      { name: categoryData?.name || "Category", item: `${ROUTE_CONSTANTS.LOCATION}/${slug}${ROUTE_CONSTANTS.CATEGORY}/${slugcategory}` },
    ];
  }

  return (
    <section>
      <BreadcrumbJsonLd
        items={getBreadcrumbJsonLdItems()}
      />
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedLocation={selectionLocation}
        selectedCategory={selectedCategory}
      />
      <div className="common-section">
        {/* Breadcrumb Navigation */}
        <div className="pt-4">
          <Breadcrumb
            items={getBreadcrumbJsonLdItems()}
          />
        </div>
        <div className="grid grid-cols-12 gap-4 pb-4">
          <div className="grid-col-span-9 ">
            <Suspense key={page?.toString()} fallback={<SkeletonAuctionList />}>
              <AuctionResults
                searchParams={searchParams}
                heading={`${categoryData.name} Bank Properties in  ${locationData.name}`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
            <TopBanks
              bankOptions={popularBanks}
              locationSlug={slug}
              isLocationCategoriesRoute={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
