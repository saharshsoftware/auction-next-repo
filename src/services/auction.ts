"use client";
import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/shared/Axios";
import {
  sanitizeStrapiData,
  sanitizedAuctionData,
  sanitizedAuctionDetail,
} from "@/shared/Utilies";
import { IAlert, IAssetType, IAuction, ICategoryCollection } from "@/types";

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
    const sendResponse = sanitizeStrapiData(data.data) as any;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const createSavedSearch = async (props:{formData: {name: string; filter: string}}) => {
  try {
    const {formData} = props
    const URL = API_BASE_URL + API_ENPOINTS.SAVED_SEARCH;
    
    const { data } = await postRequest({ API: URL, DATA: formData });
    
    console.log(data, "responsefetch");
    return data;
  } catch (e:any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    return e
  }
};

export const fetchSavedSearch = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.SAVED_SEARCH;
    const { data } = await getRequest({ API: URL });
    console.log(data, "responsefetch");
    return data;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const updateSavedSearch = async (payload: {
  id: string;
  body: { name: string };
}) => {
  try {
    const { id, body } = payload;
    const URL = API_BASE_URL + API_ENPOINTS.SAVED_SEARCH + `/${id}`;

    const { data } = await putRequest({ API: URL, DATA: body });

    console.log(data, "responsefetch");
    return data;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const deleteSavedSearch = async (props: {id: string}) => {
  const {id} = props
  try {
    const URL = API_BASE_URL + API_ENPOINTS.SAVED_SEARCH + `/${id}`;
    const { data } = await deleteRequest({ API: URL });
    console.log(data, "responsefetch");
    return data;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const createAlertSearch = async (body: {
  name: string;
  location: string;
  assetType: string;
  assetCategory: string;
  bankName?: string;
  minPrice?: string,
  maxPrice?: string,
}) => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.ALERTS;

    const { data } = await postRequest({ API: URL, DATA: body });

    console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    return e;
  }
};

export const fetchAlerts = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.ALERTS;
    const { data } = await getRequest({ API: URL });
    console.log(data, "responsefetch");
    // const sanitizeData = sanitizeStrapiData(data?.data) as IAlert[];
    // return {data: sanitizeData, meta: data?.data?.meta};
    return data
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const updateAlert = async (payload: {
  id: string;
  body: {
    name: string;
    location: string;
    assetType: string;
    assetCategory: string;
    bankName?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) => {
  try {
    const { id, body } = payload;
    const URL = API_BASE_URL + API_ENPOINTS.ALERTS + `/${id}`;

    const { data } = await putRequest({ API: URL, DATA: body });

    console.log(data, "responsefetch");
    return data;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const deleteAlert = async (props: { id: string }) => {
  const { id } = props;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.ALERTS + `/${id}`;
    const { data } = await deleteRequest({ API: URL });
    console.log(data, "responsefetch");
    return data;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
  }
};

export const showInterest = async (body: { user: string; ipAddress: string; notice:string }) => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.INTEREST;

    const { data } = await postRequest({ API: URL, DATA: {data:body} });

    console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    return e;
  }
};