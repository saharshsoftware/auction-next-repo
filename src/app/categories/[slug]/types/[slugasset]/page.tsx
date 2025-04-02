import AuctionHeaderServer from "@/components/atoms/AuctionHeaderServer";
import { ILocalFilter } from "@/components/atoms/PaginationCompServer";
import FindAuctionServer from "@/components/molecules/FindAuctionServer";
import RecentData from "@/components/molecules/RecentData";
import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import {
  fetchBanks,
  getCategoryBoxCollection,
  fetchLocation,
} from "@/server/actions";
import { fetchAssetTypeBySlug } from "@/server/actions/assetTypes";
import {
  fetchAssetType,
  fetchCategories,
  getAssetType,
  getAuctionsServer,
  getCategoryBoxCollectionBySlug,
} from "@/server/actions/auction";
import { RANGE_PRICE } from "@/shared/Constants";
import { sanitizeReactSelectOptionsPage } from "@/shared/Utilies";
import { IAssetType, ICategoryCollection, ILocations, IAuction } from "@/types";
import { IPaginationData } from "@/zustandStore/auctionStore";

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
  const [rawAssetTypes, rawBanks, rawCategories, rawLocations, response]: any =
    await Promise.all([
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
              heading={`Bank Auction ${assetTypeData?.name} in India `}
            />
            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={page ? Number(page) : 1}
              filterData={urlFilterdata}
            />
          </div>
          <div className="lg:col-span-4 col-span-full">
            <RecentData />
          </div>
        </div>
      </div>
    </section>
  );
}
