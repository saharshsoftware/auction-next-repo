"use client";
import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import {
  sanitizeStrapiData,
  sanitizedAuctionData,
  sanitizedAuctionDetail,
} from "@/shared/Utilies";
import { IAssetType, IAuction, ICategoryCollection } from "@/types";

export const getAssetTypeClient = async () => {
  // "use server";
  try {
    const filter = `?sort[0]=name:asc`;
    const URL = API_BASE_URL + API_ENPOINTS.ASSET_TYPES + `${filter}`;
    console.log(URL, "assetstype-detail");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as IAssetType;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error auction detail");
  }
};

export const getAuctionDataClient = async (payload: {
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

      if ((locationType === 'city') && location) {
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
        filter += `filters[$and][${index++}][reservePrice][$gte]=${reservePrice[0]}&filters[$and][${index++}][reservePrice][$lte]=${reservePrice[1]}&`;
      }
      URL = API_ENPOINTS.NOTICES + filter.slice(0, -1); // Remove the trailing '&' if present
    }

    console.log(URL, "auction-filter");
    const { data } = await getRequest({ API: URL });
    console.log(data, ">123");
    let sendResponse;;
    if (keyword) {
      sendResponse= data?.data as IAuction[]; 
      return { sendResponse, meta: data?.meta };
    }
    sendResponse = sanitizedAuctionData(data.data) as IAuction[];
    return { sendResponse, meta: data?.meta?.pagination };
  } catch (e) {
    console.log(e, "Error Auction api");
  }
};

export const getAuctionDetailClient = async ({ slug }: { slug: string }) => {
  // "use server";
  try {
    const filter = `?filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.NOTICES + `${filter}`;
    // const URL = API_BASE_URL + API_ENPOINTS.NOTICES + `/${slug}`;
    console.log(URL, "auction-detail");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizedAuctionDetail(data.data?.[0]) as IAuction;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error auction detail");
  }
};

export const getCategoryBoxCollectionClient = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CATEGORY_BOX_COLLETIONS;
    console.log(URL, "category-url");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as ICategoryCollection;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error category-box");
  }
};

export const getHomeBoxCollectionClient = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.HOME_BOX_COLLECTIONS;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as ICategoryCollection;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error Home-box");
  }
};

export const getCollectionDataClient = async (props: { endpoints: string }) => {
  try {
    const { endpoints } = props;
    const URL =
      API_BASE_URL +
      endpoints +
      `?sort[0]=name:asc&populate=*&filters[$and][0][isPopular]=true`;
    // console.log(URL, "URLCollection")
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as any;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const getCollectionDataClientFetch = async (props: { endpoints: string }) => {
  try {
    const { endpoints } = props;
    const URL =
      API_BASE_URL +
      endpoints +
      `?sort[0]=name:asc&populate=*&filters[$and][0][isPopular]=true`;
    // console.log(URL, "URLCollection")
    const response = await fetch(URL, { next: { revalidate: 3600 } });
    const data = await response.json()
    console.log(data, "responsefetch");
    // const sendResponse = sanitizeStrapiData(data.data) as any;
    // return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};
