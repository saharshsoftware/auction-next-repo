import { LeadRecommendationsResponse, PaginationMeta } from "@/types";

export const STATIC_USER_RECOMMENDATIONS: LeadRecommendationsResponse = {
  data: [
    {
        "id": 4282,
        "title": "Cent Bank Home Finance Limited Flat Auction in JAMBHUL MAVAL, Pune",
        "bankName": "Cent Bank Home Finance Limited",
        "branchName": "Rasta Peth, Pune",
        "serviceProvider": "Public Auction",
        "assetCategory": "Residential",
        "assetType": "Flat",
        "state": "Maharashtra",
        "city": "Pune",
        "propertyAddress": null,
        "auctionStartTime": "2025-02-12T10:30:00.000Z",
        "auctionEndDate": "2025-02-12T11:30:00.000Z",
        "reservePrice": 551000,
        "emd": 55100,
        "noticeLink": "https://www.eauctionsindia.com/properties/435472",
        "contact": "Ph No : 020-26136933",
        "noticeImageURL": null,
        "slug": "cent-bank-home-finance-limited-flat-auction-in-jambhul-maval-pune-423g44kytq"
    },
    {
        "id": 4283,
        "title": "Cent Bank Home Finance Limited Flat Auction in Maval, Pune",
        "bankName": "Cent Bank Home Finance Limited",
        "branchName": "Rasta Peth, Pune",
        "serviceProvider": "Public Auction",
        "assetCategory": "Residential",
        "assetType": "Flat",
        "state": "Maharashtra",
        "city": "Pune",
        "propertyAddress": null,
        "auctionStartTime": "2025-02-12T10:30:00.000Z",
        "auctionEndDate": "2025-02-12T11:30:00.000Z",
        "reservePrice": 630000,
        "emd": 63000,
        "noticeLink": "https://www.eauctionsindia.com/properties/435470",
        "contact": "Ph No : 020-26136933",
        "noticeImageURL": null,
        "slug": "cent-bank-home-finance-limited-flat-auction-in-maval-pune-yfmiialtp8"
    }
],
};

export const getStaticTopRecommendations = (limit: number = 10) => {
  const base = [...STATIC_USER_RECOMMENDATIONS.data];
  if (base.length === 0) return [];
  // Repeat items to reach at least `limit` for demo purposes
  const repeated: typeof base = Array.from({ length: Math.ceil(limit / base.length) })
    .map(() => base)
    .flat();
  // simple randomization for demo
  repeated.sort(() => Math.random() - 0.5);
  return repeated.slice(0, limit);
};

export const getStaticRecommendationsByPage = (
  page: number = 1,
  pageSize: number = 10
) => {
  const base = [...STATIC_USER_RECOMMENDATIONS.data];
  if (base.length === 0) return { data: [], meta: { pagination: { page, pageSize, pageCount: 1, total: 0 } as PaginationMeta } };
  const total = base.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const slice = base.slice(start, end);
  const pagination: PaginationMeta = {
    page,
    pageSize,
    pageCount,
    total,
    hasPreviousPage: page > 1,
    hasNextPage: page < pageCount,
  };
  return { data: slice, meta: { pagination } } as LeadRecommendationsResponse;
};


