"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { sanitizeStrapiData, sanitizedAuctionData, sanitizedAuctionDetail } from "@/shared/Utilies";
import { IAuction, ICategoryCollection } from "@/types";

export const getAuctionData = async (payload: {category?: string, bankName?: string; reservePrice?: string;}) => {
  try {
    const {category, bankName, reservePrice} = payload
    const filter = `?filters[$or][0][propertyType][$eq]=${
      category ?? ""
    }&filters[$or][1][bankName]=${
      bankName ?? ""
    }&filters[$or][2][reservePrice]=${reservePrice ?? ""}`;
    const URL = API_BASE_URL + API_ENPOINTS.NOTICES + filter;
    console.log(URL)
    const {data} = await getRequest({API: URL})
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
    const {data} = await getRequest({ API: URL });
    const sendResponse = sanitizedAuctionDetail(data.data) as IAuction;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error");
  }
};

export const getCategoryBoxCollection = async () => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CATEGORY_BOX_COLLETIONS;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as ICategoryCollection;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error");
  }
};