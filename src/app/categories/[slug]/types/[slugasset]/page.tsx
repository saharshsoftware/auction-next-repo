import CategorySpecificAssets from "@/components/atoms/CategorySpecificAssets";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopCategory from "@/components/atoms/TopCategory";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import {
  fetchBanks,
  fetchLocation,
} from "@/server/actions";
import { fetchAssetType, fetchCategories } from "@/server/actions/auction";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  extractOnlyKeywords,
  getCategorySpecificAssets,
  getPopularDataBySortOrder,
  sanitizeCategoryTypeTitle,
  sanitizeReactSelectOptionsPage,
} from "@/shared/Utilies";
import { IAssetType, ICategoryCollection, ILocations } from "@/types";
import { ResolvingMetadata, Metadata } from "next";
import { Suspense, cache } from "react";
import { buildCanonicalUrl } from "@/shared/Utilies";
import AuctionResults from "@/components/templates/AuctionResults";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
  
const getCategoriesCached = cache(async () => {
  return (await fetchCategories()) as ICategoryCollection[] | null;
});

const getAssetTypesCached = cache(async () => {
  return (await fetchAssetType()) as IAssetType[] | null;
});

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { slug: string; slugasset: string };
    searchParams: { [key: string]: string | string[] | undefined };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, slugasset } = params;

  try {
    const [categories, assets] = await Promise.all([
      getCategoriesCached(),
      getAssetTypesCached(),
    ]);
    const categoryData = categories?.find((c) => c.slug === slug);
    const assetTypeData = assets?.find((a) => a.slug === slugasset);

    const name = categoryData?.name ?? "";
    let keywordsAll: string[] = [];
    if (name) {
      keywordsAll = extractOnlyKeywords(assets || [], name);
    }
    const sanitizeImageUrl =
      (process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "") + categoryData?.imageURL;
    console.log("Name", { name });
    const sanitizeTitle = assetTypeData ? sanitizeCategoryTypeTitle(
      name ?? "",
      assetTypeData,
      true
    ) : '';
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `${ROUTE_CONSTANTS.CATEGORY}/${slug}${ROUTE_CONSTANTS.TYPES}/${slugasset}`,
      page: searchParams?.page,
    });
    const logoUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;
    return {
      title: sanitizeTitle,
      description: `Find ${name} ${assetTypeData?.name} bank auction properties on eauctiondekho. Explore diverse assets including ${keywordsAll}.`,
      alternates: { canonical: canonicalUrl },
      keywords: [
        `${name} bank auction properties`,
        ...keywordsAll.map((k) => `${k} bank auction`),
      ],

      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: sanitizeTitle,
        description: `Find ${name} ${assetTypeData?.name} bank auction properties on eauctiondekho. Explore diverse assets including ${keywordsAll}.`,
        images: logoUrl,
        siteName: "eauctiondekho",
        locale: "en_IN",
      },
      twitter: {
        site: "@eauctiondekho",
        card: "summary_large_image",
        title: sanitizeTitle,
        description: `Find ${name} ${assetTypeData?.name} bank auction properties on eauctiondekho. Explore diverse assets including ${keywordsAll}.`,
        images: logoUrl,
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
  params: { slug: string; slugasset: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugasset } = params;
  const { page = 1 } = searchParams;

  console.log("filterQueryDataBank");

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
  ]: any = await Promise.all([
    getAssetTypesCached(),
    fetchBanks(),
    getCategoriesCached(),
    fetchLocation(),
  ]);

  const popularCategories = getPopularDataBySortOrder(rawCategories);
  const popularAssets = rawAssetTypes;

  // Type assertions are no longer necessary if functions return correctly typed data
  const assetsTypeOptions = sanitizeReactSelectOptionsPage(
    rawAssetTypes
  ) as IAssetType[];
  const categoryOptions = sanitizeReactSelectOptionsPage(
    rawCategories
  ) as ICategoryCollection[];
  const bankOptions = sanitizeReactSelectOptionsPage(rawBanks) as [];
  const locationOptions = sanitizeReactSelectOptionsPage(
    rawLocations
  ) as ILocations[];

  const categoryData = (rawCategories as ICategoryCollection[])?.find(
    (c) => c.slug === slug
  );
  const assetTypeData = (rawAssetTypes as IAssetType[])?.find(
    (a) => a.slug === slugasset
  );

  const selectedCategory = categoryOptions.find(
    (item) => item.name === categoryData?.name
  );
  const selectedAsset = assetsTypeOptions.find(
    (item) => item.name === assetTypeData?.name
  );

  const urlFilterdata = {
    property: assetTypeData,
    category: categoryData,
    page: String(page) || 1,
    price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  } as ILocalFilter;
  const filteredAssetsType =
    (getCategorySpecificAssets({
      response: popularAssets,
      params: { slug },
      isBankCategoriesRoute: false,
      isCategoryRoute: true,
    }) as IAssetType[]) || [];
  
    const filterAssets = getPopularDataBySortOrder(filteredAssetsType);

    const sanitizeTitle = assetTypeData ? sanitizeCategoryTypeTitle(
      categoryData?.name ?? "",
      assetTypeData
    ) : '';  

  const getRequiredParameters = () => {
    return {
      propertyType: assetTypeData?.name ?? "",
      category: categoryData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const getBreadcrumbJsonLdItems = () => {
    return [
      { name: "Home", item: `/`, breadcrumbRelativeRoute: '/' },
      { name: "Category", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.CATEGORY}`, breadcrumbRelativeRoute: ROUTE_CONSTANTS.CATEGORY },
      { name: categoryData?.name ?? "Category", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.CATEGORY}/${slug}`, breadcrumbRelativeRoute: `${ROUTE_CONSTANTS.CATEGORY}/${slug}` },
      { name: "Property Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.TYPES}`, breadcrumbRelativeRoute: ROUTE_CONSTANTS.TYPES },
      { name: assetTypeData?.name ?? "Property Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.CATEGORY}/${slug}${ROUTE_CONSTANTS.TYPES}/${slugasset}`, breadcrumbRelativeRoute: `${ROUTE_CONSTANTS.CATEGORY}/${slug}${ROUTE_CONSTANTS.TYPES}/${slugasset}` },
    ];
  };

  return (
    <section>
      <FindAuctionServer
        categories={categoryOptions}
        assets={assetsTypeOptions}
        banks={bankOptions}
        locations={locationOptions}
        selectedCategory={selectedCategory}
        selectedAsset={selectedAsset}
      />
      <div className="common-section">
        
        <BreadcrumbJsonLd
          items={getBreadcrumbJsonLdItems()}
        />

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
                heading={`${sanitizeTitle}`}
                useCustomFilters={true}
                customFilters={getRequiredParameters()}
                urlFilterdata={urlFilterdata}
              />
            </Suspense>
          </div>
          <div className="grid-col-span-3">
            <div className="mb-4">
              <TopCategory categoryOptions={popularCategories} />
            </div>
            <div>
              <CategorySpecificAssets
                assetsTypeData={filterAssets}
                isCategoryRoute={true}
                categorySlug={slug}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
