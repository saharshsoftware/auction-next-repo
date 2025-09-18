import ShowAuctionListServer from "@/components/molecules/ShowAuctionListServer";
import { getAuctionsServer } from "@/server/actions/auction";
import { getDataFromQueryParamsMethod } from "@/shared/Utilies";
import AuctionHeaderServer from "../atoms/AuctionHeaderServer";
import AuctionHeaderSaveSearch from "../atoms/AuctionHeaderSaveSearch";
import { cookies } from "next/headers";
import { COOKIES } from "@/shared/Constants";
import { Suspense, cache } from "react";
import { SkeletonAuctionList } from "@/components/skeltons/SkeletonAuctionList";
import { IAuction } from "@/types";
import type { ILocalFilter } from "@/components/atoms/PaginationCompServer";

export const dynamic = "force-dynamic";

interface ICustomFilters {
  category?: string;
  bankName?: string;
  location?: string;
  propertyType?: string;
  reservePrice?: string[];
  locationType?: string;
  page?: string;
  serviceProvider?: string;
  keyword?: string;
  sort?: string;
}

interface IFilterQueryData {
  category?: { name?: string };
  bank?: { name?: string };
  location?: { name?: string; type?: string };
  propertyType?: { name?: string };
  price?: string[];
  page?: number | string;
  serviceProvider?: { value?: string };
}

interface IAuctionsMeta {
  total?: number;
  pageCount?: number;
}

interface IAuctionsResponse {
  sendResponse?: IAuction[];
  meta?: IAuctionsMeta;
}

const getAuctionsCached = cache(async (filters: ICustomFilters) => {
  return (await getAuctionsServer(filters)) as IAuctionsResponse;
});

const AuctionHeaderFallback = () => (
  <div className="h-8 w-64 rounded bg-gray-200 animate-pulse mb-4" />
);

async function AuctionsHeaderBlock({
  heading,
  isFindAuction,
  requestFilters,
  searchParams,
}: {
  heading?: string;
  isFindAuction?: boolean;
  requestFilters: ICustomFilters;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (heading) {
    const { sort: _ignored, ...filtersWithoutSort } = requestFilters;
    const response = await getAuctionsCached(filtersWithoutSort);
    return (
      <AuctionHeaderServer
        total={response?.meta?.total ?? 0}
        heading={heading}
      />
    );
  }
  if (isFindAuction) {
    return <AuctionHeaderSaveSearch searchParams={searchParams} />
  }
  return null;
}

async function AuctionsListBlock({
  requestFilters,
  activePageNumber,
  urlFilterdata,
}: {
  requestFilters: ICustomFilters;
  activePageNumber: number;
  urlFilterdata?: ILocalFilter;
}) {
  const response = await getAuctionsCached(requestFilters);
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <ShowAuctionListServer
        auctions={auctions}
        totalPages={response?.meta?.pageCount || 1}
        activePage={activePageNumber}
        filterData={urlFilterdata as ILocalFilter}
      />
    </>
  );
}

interface IAuctionResultsProps {
  searchParams: Record<string, string | string[] | undefined>;
  heading?: string;
  isFindAuction?: boolean;
  customFilters?: ICustomFilters;
  useCustomFilters?: boolean;
  urlFilterdata?: ILocalFilter;
  page?: string;
}

/**
 * Render auction results with independent streaming boundaries for header and list.
 * This component can be used directly in routes like `/banks/[slug]` without wrapping in Suspense.
 */
export default async function AuctionResults({
  searchParams,
  heading,
  isFindAuction,
  customFilters,
  useCustomFilters = false,
  urlFilterdata,
  page
}: IAuctionResultsProps) {
  // Get sort from cookie, default to "effectiveAuctionStartTime:desc"
  const cookieStore = cookies();
  const sortFromCookie = cookieStore.get(COOKIES.SORT_KEY)?.value || "effectiveAuctionStartTime:desc";

  // Resolve filters once; data fetching will occur inside sub-components under Suspense
  const resolvedFilters: IFilterQueryData | undefined = useCustomFilters && customFilters
    ? { page: customFilters.page || "1" }
    : (getDataFromQueryParamsMethod(
        Array.isArray(searchParams?.q) ? searchParams.q[0] : searchParams?.q ?? ""
      ) as unknown as IFilterQueryData);

  const requestFilters: ICustomFilters = useCustomFilters && customFilters
    ? { ...customFilters, sort: sortFromCookie }
    : {
        category: resolvedFilters?.category?.name ?? "",
        bankName: resolvedFilters?.bank?.name ?? "",
        location: resolvedFilters?.location?.name ?? "",
        propertyType: resolvedFilters?.propertyType?.name ?? "",
        reservePrice: resolvedFilters?.price ?? [],
        locationType: resolvedFilters?.location?.type ?? "",
        page: resolvedFilters?.page?.toString() ?? "1",
        serviceProvider: resolvedFilters?.serviceProvider?.value ?? "",
        sort: sortFromCookie,
      };

  const activePageNumber: number = resolvedFilters?.page ? Number(resolvedFilters.page) : Number(requestFilters.page ?? 1);

  return (
    <div key={`auctions-section-${requestFilters.page}`}>
      {(heading || isFindAuction) && (
        <Suspense fallback={<AuctionHeaderFallback />}>
          <AuctionsHeaderBlock
            heading={heading}
            isFindAuction={isFindAuction}
            requestFilters={requestFilters}
            searchParams={searchParams}
          />
        </Suspense>
      )}
      <Suspense key={requestFilters.sort} fallback={<SkeletonAuctionList />}>
        <AuctionsListBlock
          requestFilters={requestFilters}
          activePageNumber={activePageNumber}
          urlFilterdata={urlFilterdata as ILocalFilter}
        />
      </Suspense>
    </div>
  );
}
