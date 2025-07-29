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

    return {
      title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
      description: `Explore bank auction properties in ${name} on eAuctionDekho. Find diverse asset types including flats, houses, plots, residential units, agricultural land, bungalows, cars, vehicles, commercial buildings, offices, shops, factory lands, godowns, industrial buildings, lands, machinery, non-agricultural lands, scrap, and sheds. Secure the best deals today tailored to your investment needs`,

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
        `eAuctionDekho ${name} listings`,
      ],

      openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/lcoations/${slug}`,
        title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Looking for auctions in ${name}? eauctiondekho offers a detailed list of auctions for properties, vehicles, and more. Start bidding in ${name} and make successful investments with ease.`,
        images: sanitizeImageUrl,
      },
      twitter: {
        site: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/locations/${slug}`,
        card: "summary_large_image",
        title: `Bank Auction Properties in ${name} | Find Residential, Commercial, Vehicle, and Gold Auctions`,
        description: `Join the dynamic auction market in ${name} with eauctiondekho. Discover and bid on a variety of high-quality assets in ${name}, and secure valuable deals today.`,
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
    response,
    popularBanks,
  ]: any = await Promise.all([
    fetchAssetType(),
    fetchBanks(),
    fetchCategories(),
    fetchLocation(),
    getAuctionsServer({
      location: filterQueryData?.location?.name ?? "",
      locationType: filterQueryData?.location?.type ?? "",
      page: String(page) || "1",
      reservePrice: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    }),
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

  const auctionList =
    (response as { sendResponse: IAuction[]; meta: IPaginationData })
      ?.sendResponse ?? [];

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
            <AuctionHeaderServer
              total={response?.meta?.total}
              heading={`Auction Properties in ${name}`}
            />

            <ShowAuctionListServer
              auctions={auctionList}
              totalPages={response?.meta?.pageCount || 1}
              activePage={page ? Number(page) : 1}
              filterData={urlFilterdata}
            />
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
