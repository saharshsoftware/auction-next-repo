import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import CategorySpecificAssets from "@/components/atoms/CategorySpecificAssets";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import TopCategory from "@/components/atoms/TopCategory";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
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
  sanitizeCategorytitle,
  sanitizeCategoryTypeTitle,
  sanitizeReactSelectOptionsPage,
} from "@/shared/Utilies";
import { IAssetType, ICategoryCollection, ILocations, IAuction } from "@/types";
import { IPaginationData } from "@/zustandStore/auctionStore";
import { ResolvingMetadata, Metadata } from "next";

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
    return {
      title: sanitizeTitle,
      description: `Find ${name} ${assetTypeData?.name}  bank auction properties for on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
      keywords: [
        `${name} bank auction properties`,
        ...keywordsAll.map((k) => `${k} bank auction`),
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories/${slug}/types/${slugasset}`,
        title: sanitizeTitle,
        description: `Find ${name} ${assetTypeData?.name}  bank auction properties for on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/categories/${slug}/types/${slugasset}`,
        card: "summary_large_image",
        title: sanitizeTitle,
        description: `Find ${name} ${assetTypeData?.name}  bank auction properties for on eAuctionDekho. Find diverse asset types including ${keywordsAll}. Secure the best deals today tailored to your investment needs`,
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
    response,
    popularCategories,
    popularAssets,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    getAuctionsServer({
      propertyType: assetTypeData?.name ?? "",
      category: categoryData?.name ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }),
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

  const auctionList =
    (response as { sendResponse: IAuction[]; meta: IPaginationData })
      ?.sendResponse ?? [];

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
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="lg:col-span-8 col-span-full">
            <AuctionHeaderServer
              total={response?.meta?.total}
              heading={`${sanitizeTitle}`}
            />
            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={page ? Number(page) : 1}
              filterData={urlFilterdata}
            />
          </div>
          <div className="lg:col-span-4 col-span-full">
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
