import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { getAuctionsServer } from "@/server/actions/auction";
import { getDataFromQueryParamsMethod } from "@/shared/Utilies";
import AuctionHeaderServer from "../atoms/AuctionHeaderServer";
import AuctionHeaderSaveSearch from "../atoms/AuctionHeaderSaveSearch";

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

  if (useCustomFilters && customFilters) {
    // Use custom filters directly
    response = await getAuctionsServer(customFilters);
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
      return <AuctionHeaderSaveSearch />
    }
    return null;
  };

  return (
    <>
      {renderAuctionHeaderComponent()}
      <ShowAuctionListServer
        auctions={response?.sendResponse ?? []}
        totalPages={response?.meta?.pageCount || 1}
        activePage={filterQueryData?.page ? Number(filterQueryData?.page) : 1}
        filterData={urlFilterdata}
      />
    </>
  );
}
