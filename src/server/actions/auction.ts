"use server";

import { cookies } from "next/headers";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import {
  generateQueryParamString,
  sanitizeStrapiData,
  sanitizedAuctionData,
  sanitizedAuctionDetail,
} from "@/shared/Utilies";
import { IAssetType, IAuction, ICategoryCollection } from "@/types";

export const getAuctionData = async (payload: {
  page?: string;
  category?: string;
  bankName?: string;
  reservePrice?: string;
  location?: string;
  keyword?: string;
  propertyType?: string;
  locationType?: string;
}) => {
  try {
    const {
      page,
      category,
      bankName,
      reservePrice,
      location,
      keyword,
      propertyType,
      locationType,
    } = payload;
    const pageSize = 10;
    let URL;
    let filter = `?pagination[page]=${
      page ?? 1
    }&pagination[pageSize]=${pageSize}&`;

    let filterSearch = `?pageSize=${pageSize}&pageNo=${page}&`;
    // debugger;
    if (keyword) {
      filterSearch += `q=${encodeURI(keyword)}&`;
      URL = API_ENPOINTS.NOTICES + "/search" + filterSearch.slice(0, -1); // Remove the trailing '&' if
    } else {
      let index = 0; // Initialize index counter

      if (category) {
        filter += `filters[$and][${index++}][assetCategory]=${encodeURI(
          category
        )}&`;
      }
      if (bankName) {
        filter += `filters[$and][${index++}][bankName]=${encodeURI(bankName)}&`;
      }

      if (locationType === "city" && location) {
        filter += `filters[$and][${index++}][city]=${encodeURI(location)}&`;
      }

      if (locationType === "state" && location) {
        filter += `filters[$and][${index++}][state]=${encodeURI(location)}&`;
      }

      if (propertyType) {
        filter += `filters[$and][${index++}][assetType]=${encodeURI(
          propertyType
        )}&`;
      }

      if (reservePrice) {
        filter += `filters[$and][${index++}][reservePrice][$gte]=${
          reservePrice[0]
        }&filters[$and][${index++}][reservePrice][$lte]=${reservePrice[1]}&`;
      }
      URL = API_ENPOINTS.NOTICES + filter.slice(0, -1); // Remove the trailing '&' if present
    }
    const { data } = await getRequest({ API: URL });
    let sendResponse;
    if (keyword) {
      sendResponse = data?.data as IAuction[];
      return { sendResponse, meta: data?.meta };
    }
    sendResponse = sanitizedAuctionData(data.data) as IAuction[];
    return { sendResponse, meta: data?.meta?.pagination };
  } catch (e) {
    console.log(e, "Error Auction api");
  }
};

export const getAuctionDetail = async ({ slug }: { slug: string }) => {
  "use server";
  try {
    const filter = `?filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.NOTICES + `${filter}`;
    console.log(URL, "auction-detail");
    const { data } = await getRequest({ API: URL });
    // console.log(data, ">>detail")
    const sendResponse = sanitizedAuctionDetail(data.data?.[0]) as IAuction;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error auction detail");
  }
};

export const getCategoryBoxCollection = async () => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CATEGORY_BOX_COLLETIONS;
    // console.log(URL, "category-url");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as unknown;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error category-box");
  }
};

export const getCategoryBoxCollectionBySlug = async (props: {
  slug: string;
}) => {
  "use server";
  try {
    const { slug } = props;
    const filter = `?filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.CATEGORY_BOX_COLLETIONS + filter;
    // console.log(URL, "category-url-slug");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as unknown;
    return sendResponse;
  } catch (e) {
    console.log(e, "category-slug error category-box");
  }
};

export const getHomeBoxCollection = async () => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.HOME_BOX_COLLECTIONS;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as ICategoryCollection;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error Home-box");
  }
};

export const getCollectionData = async (props: { endpoints: string }) => {
  "use server";
  try {
    const { endpoints } = props;
    const requiredkeys = generateQueryParamString(["name", "slug", "imageURL"]);
    let filter =
      endpoints + `?populate=*&filters[isPopular]=true&${requiredkeys}`;
    if (endpoints === "locations") {
      filter += `&filters[type]=city`;
    }
    const URL = API_BASE_URL + `/api/` + filter;
    // console.log(URL, "URL-auctionDetail");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as any;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const getCookietoken = () => cookies()?.get("auction-token")?.value;

export const getCarouselData = async () => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.HOME_BOX_COLLECTIONS;
    const { data } = await getRequest({ API: URL });
    const categories = sanitizeStrapiData(
      data.data,
      true
    ) as ICategoryCollection;

    const categorizedData = await Promise.all(
      categories.map(async (category: any) => {
        const collectionData = await getCollectionData({
          endpoints: category.strapiAPIQuery,
        });
        return { ...category, collectionData };
      })
    );

    // console.log(categorizedData, "categorizedData");
    return categorizedData;
  } catch (e) {
    console.log(e, "auctionDetail error Home-box");
  }
};

export const getAssetType = async () => {
  "use server";
  try {
    const filter = `?sort[0]=name:asc`;
    const URL = API_BASE_URL + API_ENPOINTS.ASSET_TYPES + `${filter}`;
    // console.log(URL, "assetstype-detail");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as IAssetType;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error auction detail");
  }
};
