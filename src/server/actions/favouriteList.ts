"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { CACHE_TIMES } from "@/shared/Constants";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/shared/Axios";
import { COOKIES } from "@/shared/Constants";
import { cookies } from "next/headers";

export const fetchFavoriteList = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIES.TOKEN_KEY)?.value; // Replace with your actual cookie name

    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST;

    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch faviourite list");
    }

    const responseResult = await response.json();
    return responseResult;
  } catch (e) {
    console.log(e, "fetchfav error");
  }
};

export const createFavouriteList = async (body: { name: string }) => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST + "/create";
    const { data } = await postRequest({
      API: URL,
      DATA: body,
    });
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const fetchFavoriteListProperty = async (params: { listId: string }) => {
  try {
    const { listId } = params;
    const URL =
      API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST_PROPERTY + `?listId=${listId}`;
    const { data } = await getRequest({ API: URL });
    console.log(data, "propertydata");
    return data;
  } catch (e) {
    console.log(e, "fetchfavourite error");
  }
};

export const deleteFavoriteList = async (params: { id: string }) => {
  try {
    const { id } = params;
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST + `/${id}`;
    console.log(URL);
    const { data } = await deleteRequest({ API: URL });
    return data;
  } catch (e) {
    console.log(e, "delete error");
  }
};

export const addPropertyToFavouriteList = async (body: {
  listId: string;
  propertyId: string;
  resetForm?: any;
}) => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST_PROPERTY + "/create";
    const { data } = await postRequest({
      API: URL,
      DATA: body,
    });
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const removePropertyFromFavoriteList = async (params: {
  id: string;
}) => {
  try {
    const { id } = params;
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST_PROPERTY + `/${id}`;
    console.log(URL);
    const { data } = await deleteRequest({ API: URL });
    return data;
  } catch (e) {
    console.log(e, "remove error");
  }
};

export const updateFavouriteList = async (payload: {
  id: string;
  body: { name: string };
}) => {
  try {
    const { id, body } = payload;
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST + `/${id}`;
    const { data } = await putRequest({
      API: URL,
      DATA: body,
    });
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const fetchPublicCollectionById = async (params: { slug: string }) => {
  try {
    const { slug } = params;
    // const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LISTS + `/${id}`;
    const URL = `${API_BASE_URL}${API_ENPOINTS.FAVOURITE_LISTS}?filters[slug][$eq]=${slug}`;
    console.log("Fetching collection from:", URL);
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: CACHE_TIMES.PUBLIC_COLLECTION_DETAIL }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch public collection");
    }

    const responseResult = await response.json();
    const sendResponse = responseResult?.data?.[0];
    return sendResponse;
  } catch (error) {
    console.error(error, "fetchPublicCollectionById error");
    return null;
  }
};

export const fetchPropertiesInCollection = async (params: {
  listId: string;
  page?: number;
  sort?: string;
  isPublic?: boolean;
}) => {
  try {
    const { listId, page = 1, sort = "auctionStartTime:asc", isPublic = true } = params;
    
    // Use the new public endpoint that doesn't require authentication
    const URL =
      API_BASE_URL +
      API_ENPOINTS.FAVOURITE_LISTS_PROPERTIES +
      `?filters[list][id][$eq]=${listId}&populate=*&pagination[page]=${page}&pagination[pageSize]=10`;

    console.log("Fetching properties from:", URL);

    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      
      // Return empty data instead of throwing error for public pages
      return {
        data: [],
        meta: { total: 0, pageCount: 1 },
        error: `Failed to fetch properties: ${response.status}`,
      };
    }

    const responseResult = await response.json();
    const meta = responseResult?.meta;
    console.log("API Response:", JSON.stringify(meta));
    
    // Transform the new API response format
    if (responseResult?.data && Array.isArray(responseResult.data)) {
      // Extract properties from the nested structure
      const transformedData = responseResult.data.map((item: any) => ({
        id: item.id,
        createdAt: item.attributes?.createdAt,
        updatedAt: item.attributes?.updatedAt,
        property: {
          id: item.attributes?.property?.data?.id,
          ...item.attributes?.property?.data?.attributes,
        },
      }));
      
      return {
        data: transformedData,
        meta
      };
    }
    
    // Fallback for unexpected response format
    return {
      data: responseResult?.data || [],
      meta: responseResult?.meta || { total: 0, pageCount: 1 },
    };
  } catch (error) {
    console.error("fetchPropertiesInCollection error:", error);
    return { data: [], meta: { total: 0, pageCount: 1 }, error: 'Failed to load properties' };
  }
};