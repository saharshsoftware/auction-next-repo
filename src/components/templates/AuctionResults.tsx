import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { getAuctionsServer } from "@/server/actions/auction";
import { getDataFromQueryParamsMethod } from "@/shared/Utilies";
import AuctionHeaderServer from "../atoms/AuctionHeaderServer";
import AuctionHeaderSaveSearch from "../atoms/AuctionHeaderSaveSearch";
import { cookies } from "next/headers";
import { COOKIES } from "@/shared/Constants";

export const dynamic = "force-dynamic";

interface IAuctionResultsProps {
  searchParams: any;
  heading?: string;
  isFindAuction?: boolean;
  // New flexible parameters
  customFilters?: {
    category?: string;
    bankName?: string;
    location?: string;
    propertyType?: string;
    reservePrice?: string[];
    locationType?: string;
    page?: string;
    serviceProvider?: string;
    keyword?: string;
  };
  // Override default query param extraction
  useCustomFilters?: boolean;
  urlFilterdata?: any;
}

export default async function AuctionResults({
  searchParams,
  heading,
  isFindAuction,
  customFilters,
  useCustomFilters = false,
  urlFilterdata
}: IAuctionResultsProps) {
  
  let filterQueryData: any;
  let response: any;

  // Get sort from cookie, default to "effectiveAuctionStartTime:desc"
  const cookieStore = cookies();
  const sortFromCookie = cookieStore.get(COOKIES.SORT_KEY)?.value || "effectiveAuctionStartTime:desc";

  if (useCustomFilters && customFilters) {
    // Use custom filters directly
    response = await getAuctionsServer({
      ...customFilters,
      sort: sortFromCookie // Use passed sort or cookie
    });
    filterQueryData = {
      page: customFilters.page || "1"
    };
  } else {
    // Use default query param extraction (existing behavior)
    filterQueryData = getDataFromQueryParamsMethod(
      Array.isArray(searchParams?.q) ? searchParams.q[0] : searchParams?.q ?? ""
    );

    response = await getAuctionsServer({
      category: filterQueryData?.category?.name ?? "",
      bankName: filterQueryData?.bank?.name ?? "",
      location: filterQueryData?.location?.name ?? "",
      propertyType: filterQueryData?.propertyType?.name ?? "",
      reservePrice: filterQueryData?.price ?? [],
      locationType: filterQueryData?.location?.type ?? "",
      page: filterQueryData?.page?.toString() ?? "1",
      serviceProvider: filterQueryData?.serviceProvider?.value ?? "",
      sort: sortFromCookie // Use cookie value
    });
  }

  const renderAuctionHeaderComponent = () => {
    if(heading){
      return <AuctionHeaderServer
        total={response?.meta?.total}
        heading={heading}
      />
    }
    if (isFindAuction) {
      return <AuctionHeaderSaveSearch searchParams={searchParams} />
    }
    return null;
  };

  const renderItemListJsonLd = () => {
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "";
    const auctions = Array.isArray(response?.sendResponse) ? response.sendResponse : [];
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: auctions
        .filter((auction: { slug?: string }) => !!auction?.slug)
        .slice(0, 10)
        .map((auction: { slug?: string; title?: string; noticeImageUrl?: string; noticeImageURLs?: string[] }, index: number) => {
          const url = `${baseUrl}/auctions/${auction.slug}`;
          const image = Array.isArray(auction?.noticeImageURLs) && auction.noticeImageURLs.length > 0
            ? auction.noticeImageURLs[0]
            : (auction?.noticeImageUrl || undefined);
          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "WebPage",
              url,
              ...(auction?.title ? { name: auction.title } : {}),
              ...(image ? { image } : {}),
            },
          };
        }),
    } as const;
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    );
  };

  return (
    <>
      {renderAuctionHeaderComponent()}
      {renderItemListJsonLd()}
      <ShowAuctionListServer
        auctions={response?.sendResponse ?? []}
        totalPages={response?.meta?.pageCount || 1}
        activePage={filterQueryData?.page ? Number(filterQueryData?.page) : 1}
        filterData={urlFilterdata}
      />
    </>
  );
}
