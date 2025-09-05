import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import CategorySpecificAssets from "@/components/atoms/CategorySpecificAssets";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopCategory from "@/components/atoms/TopCategory";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import {
  fetchBanks,
  getCategoryBoxCollection,
  fetchLocation,
} from "@/server/actions";
import {
  fetchAssetTypeBySlug,
  fetchAssetTypes,
} from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  fetchPopularAssets,
  fetchPopularCategories,
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollectionBySlug,
} from "@/server/actions/auction";
import { RANGE_PRICE } from "@/shared/Constants";
import {
  extractOnlyKeywords,
  getCategorySpecificAssets,
  sanitizeCategorySEOH1title,
  sanitizeCategorytitle,
  sanitizeCategoryTypeTitle,
  sanitizeReactSelectOptionsPage,
} from "@/shared/Utilies";
import { IAssetType, ICategoryCollection, ILocations, IAuction } from "@/types";
import { IPaginationData } from "@/zustandStore/auctionStore";
import { ResolvingMetadata, Metadata } from "next";
import { Suspense } from "react";
import { buildCanonicalUrl } from "@/shared/Utilies";
import AuctionResults from "@/components/templates/AuctionResults";
import Breadcrumb from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import BreadcrumbJsonLd from "@/components/atoms/BreadcrumbJsonLd";
  
async function getSlugData(
  slug: string,
  slugasset: string
): Promise<{ assetType: IAssetType; category: ICategoryCollection }> {
  const [selectedCategory, selectedLocation] = await Promise.all([
    getCategoryBoxCollectionBySlug({
      slug,
    }) as Promise<[ICategoryCollection]>,
    fetchAssetTypeBySlug({
      slug: slugasset,
    }) as Promise<IAssetType[]>,
  ]);
  return {
    assetType: selectedLocation?.[0] as IAssetType,
    category: selectedCategory?.[0] as ICategoryCollection,
  };
}

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
    const { assetType: assetTypeData, category: categoryData } =
      await getSlugData(slug, slugasset);

    const { name, subCategories } = categoryData;
    let keywordsAll: string[] = [];
    if (name) {
      const allSssetTypeData = await fetchAssetTypes();
      keywordsAll = extractOnlyKeywords(allSssetTypeData, name);
    }
    const sanitizeImageUrl =
      (process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "") + categoryData?.imageURL;
    console.log("Name", { name });
    const sanitizeTitle = sanitizeCategoryTypeTitle(
      name ?? "",
      assetTypeData,
      true
    );
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL as string;
    const canonicalUrl = buildCanonicalUrl({
      baseUrl,
      pathname: `/categories/${slug}/types/${slugasset}`,
      page: searchParams?.page,
    });

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
        images: sanitizeImageUrl,
        siteName: "eauctiondekho",
        locale: "en_IN",
      },
      twitter: {
        site: "@eauctiondekho",
        card: "summary_large_image",
        title: sanitizeTitle,
        description: `Find ${name} ${assetTypeData?.name} bank auction properties on eauctiondekho. Explore diverse assets including ${keywordsAll}.`,
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
  params: { slug: string; slugasset: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug, slugasset } = params;
  const { page = 1 } = searchParams;

  const { assetType: assetTypeData, category: categoryData } =
    await getSlugData(slug, slugasset);
  console.log("filterQueryDataBank");

  // Fetch data in parallel
  const [
    rawAssetTypes,
    rawBanks,
    rawCategories,
    rawLocations,
    popularCategories,
    popularAssets,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    fetchPopularCategories(),
    fetchPopularAssets(),
  ]);

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

  const sanitizeTitle = sanitizeCategoryTypeTitle(
    categoryData?.name ?? "",
    assetTypeData
  );

  const getRequiredParameters = () => {
    return {
      propertyType: assetTypeData?.name ?? "",
      category: categoryData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }
  }

  const getBreadcrumbItems = () => {
    return [
      {
        label: "Category",
        href: ROUTE_CONSTANTS.CATEGORY,
      },
      {
        label: categoryData?.name ?? "Category",
        href: `${ROUTE_CONSTANTS.CATEGORY}/${slug}`,
      },
      {
        label: "Type",
        href: `${ROUTE_CONSTANTS.ASSETS}`,
      },
      {
        label: assetTypeData?.name ?? "Type",
        href: `${ROUTE_CONSTANTS.CATEGORY}/${slug}/types/${slugasset}`,
      },
    ];
  };

  const getBreadcrumbJsonLdItems = () => {
    return [
      { name: "Home", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/` },
      { name: "Category", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.CATEGORY}` },
      { name: "Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.TYPES}` },
      { name: assetTypeData?.name ?? "Type", item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.CATEGORY}/${slug}/types/${slugasset}` },
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
            items={getBreadcrumbJsonLdItems().slice(1)}
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
                assetsTypeData={filteredAssetsType}
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
