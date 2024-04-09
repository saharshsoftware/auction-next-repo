"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { sanitizeStrapiData, sanitizedAuctionData, sanitizedAuctionDetail } from "@/shared/Utilies";
import { IAuction, ICategoryCollection } from "@/types";

export const getAuctionData = async (payload: {category?: string, bankName?: string; reservePrice?: string; location?: string}) => {
  try {
    const { category, bankName, reservePrice, location } = payload;
    // const filter = `?filters[$or][0][propertyType]=${
    //   category ?? ""
    // }&filters[$or][1][bankName]=${
    //   bankName ?? ""
    // }&filters[$or][2][reservePrice]=${reservePrice ?? ""}`;
    // const URL = API_BASE_URL + API_ENPOINTS.NOTICES + filter;

    let filter = "?";
    let index = 0; // Initialize index counter

    if (category) {
      filter += `filters[$and][${index++}][assetCategory]=${encodeURI(category)}&`;
    }
    if (bankName) {
      filter += `filters[$and][${index++}][bankName]=${encodeURI(bankName)}&`;
    }
    
    if (location) {
      filter += `filters[$and][${index++}][location]=${encodeURI(location)}&`;
    }

    // if (reservePrice) {
    //   filter += `filters[$or][${index++}][reservePrice]=${reservePrice}&`;
    // }

    const URL = API_BASE_URL + API_ENPOINTS.NOTICES + filter.slice(0, -1); // Remove the trailing '&' if present

    console.log(URL, "auction-filter");
    const { data } = await getRequest({ API: URL });
    // console.log(data, ">")
    const sendResponse = sanitizedAuctionData(data.data) as IAuction[];
    return sendResponse;
  } catch (e) {
    console.log(e, "Error Auction api");
  }
};

export const getAuctionDetail = async ({ slug }: { slug: string }) => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.NOTICES + `/${slug}`;
    console.log(URL, 'auction-detail')
    const {data} = await getRequest({ API: URL });
    const sendResponse = sanitizedAuctionDetail(data.data) as IAuction;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error auction detail");
  }
};

export const getCategoryBoxCollection = async () => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CATEGORY_BOX_COLLETIONS;
    console.log(URL, "category-url")
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as ICategoryCollection;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error category-box");
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

export const getCollectionData = async (props: {endpoints: string}) => {
  "use server";
  try {
    const {endpoints} = props
    const URL = API_BASE_URL + endpoints + `?populate=*`;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as any;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
}