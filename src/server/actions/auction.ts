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
import { COOKIES, FILTER_API_REVALIDATE_TIME } from "@/shared/Constants";

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
    let filter = `?pagination[page]=${page ?? 1
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
        filter += `filters[$and][${index++}][reservePrice][$gte]=${reservePrice[0]
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

export const fetchCategories = async () => {
  "use server";
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CATEGORY_BOX_COLLETIONS;

    const response = await fetch(URL, {
      next: { revalidate: FILTER_API_REVALIDATE_TIME },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const responseResult = await response.json();
    return sanitizeStrapiData(responseResult?.data);
  } catch (e) {
    console.error(e, "Category fetch error");
    return null;
  }
};

export const fetchPopularCategories = async () => {
  "use server";
  try {
    const filter = `?filters[$and][0][isPopular]=true&pagination[page]=1&pagination[pageSize]=5`;
    const URL = API_BASE_URL + API_ENPOINTS.POPULAR_CATEGORIES + filter;

    const response = await fetch(URL, {
      next: { revalidate: FILTER_API_REVALIDATE_TIME },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const responseResult = await response.json();
    const sendResponse = sanitizeStrapiData(responseResult?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
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
    const requiredkeys = generateQueryParamString([
      "name",
      "slug",
      "pluralizeName",
    ]);
    const filter = `?sort[0]=name:asc&${requiredkeys}&populate=category`;
    const URL = API_BASE_URL + API_ENPOINTS.ASSET_TYPES + `${filter}`;
    // console.log(URL, "assetstype-detail");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data.data) as IAssetType;
    return sendResponse;
  } catch (e) {
    console.log(e, "auctionDetail error auction detail-asset-types");
  }
};

export const fetchAssetType = async () => {
  "use server";
  try {
    const requiredkeys = generateQueryParamString([
      "name",
      "slug",
      "pluralizeName",
    ]);
    const filter = `?sort[0]=name:asc&${requiredkeys}&populate=category`;
    const URL = API_BASE_URL + API_ENPOINTS.ASSET_TYPES + `${filter}`;
    console.log(URL, "assetstype-detail");
    const response = await fetch(URL, {
      next: { revalidate: FILTER_API_REVALIDATE_TIME },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch asset types");
    }

    const responseResult = await response.json();
    const result = sanitizeStrapiData(responseResult?.data) as IAssetType[];
    return result;
  } catch (e) {
    console.error(e, "Error fetching asset types");
    return null;
  }
};

export const fetchPopularAssets = async () => {
  "use server";
  try {
    const URL =
      API_BASE_URL +
      API_ENPOINTS.ASSET_TYPES +
      `?pagination[page]=1&pagination[pageSize]=50&fields[0]=name&fields[1]=slug&populate=category`;
    const response = await fetch(URL, {
      next: { revalidate: FILTER_API_REVALIDATE_TIME },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch asset types");
    }

    const responseResult = await response.json();
    const result = sanitizeStrapiData(responseResult?.data) as IAssetType[];
    return result;
  } catch (e) {
    console.error(e, "Error fetching asset types");
    return null;
  }
};

export const getAuctionsServer = async (payload: {
  page?: string;
  category?: string;
  bankName?: string;
  reservePrice?: any[];
  location?: string;
  keyword?: string;
  propertyType?: string;
  locationType?: string;
}) => {
  "use server";
  let URL;
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

    let filter = `?pagination[page]=${page ?? 1
      }&pagination[pageSize]=${pageSize}&`;
    let filterSearch = `?pageSize=${pageSize}&pageNo=${page}&`;
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

      if (!locationType && location) {
        filter += `filters[$and][${index++}][location]=${encodeURI(location)}&`;
      }

      if (propertyType) {
        filter += `filters[$and][${index++}][assetType]=${encodeURI(
          propertyType
        )}&`;
      }

      if (reservePrice && reservePrice.length > 0) {
        filter += `filters[$and][${index++}][reservePrice][$gte]=${reservePrice[0]
          }&filters[$and][${index++}][reservePrice][$lte]=${reservePrice[1]}&`;
      }
    }
    const requiredkeys = generateQueryParamString([
      "bankName",
      "slug",
      "assetCategory",
      "title",
      "estimatedMarketPrice",
      "assetType",
      "reservePrice",
      "auctionDate",
      "branchName",
    ]);
    URL =
      API_ENPOINTS.NOTICES +
      filter.slice(0, -1) +
      `&${requiredkeys}&sort=auctionDate:desc`;
    const UPDATE_URL = API_BASE_URL + URL;
    console.log({ UPDATE_URL }, "auction-detail");
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizedAuctionData(data.data) as IAuction[];
    return { sendResponse, meta: data?.meta?.pagination, UPDATE_URL };
  } catch (e) {
    console.log(URL, "auctionDetail error auction notices");
  }
};

export const fetchAlertsServer = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value; // Replace with your actual cookie name

    const URL = API_BASE_URL + API_ENPOINTS.ALERTS;

    const response = await fetch(URL, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch alerts");
    }

    const data = await response.json();
    console.log(data, "responsefetch");
    // const sanitizeData = sanitizeStrapiData(data?.data) as IAlert[];
    // return {data: sanitizeData, meta: data?.data?.meta};
    return data;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
    return []
  }
};

export const fetchSavedSearchServer = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value; // Replace with your actual cookie name

    const URL = API_BASE_URL + API_ENPOINTS.SAVED_SEARCH;

    const response = await fetch(URL, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch saved searches");
    }
    const data = await response.json();
    console.log(data, "responsefetch");
    return data;
  } catch (e) {
    console.log(e, "auctionDetail error collection");
    return []
  }
};

export const fetchFavoriteListServer = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value; // Replace with your actual cookie name
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST;
    const response = await fetch(URL, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to faviourite list");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e, "fetchfav error");
    return []
  }
};