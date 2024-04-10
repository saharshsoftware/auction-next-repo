"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/shared/Axios";

export const fetchFavoriteList = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST;
    const { data } = await getRequest({ API: URL });
    return data;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const createFavouriteList = async (body: {name: string}) => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST+ '/create';
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
    console.log(data, "propertydata")
    return data;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const deleteFavoriteList = async (params: { id: string }) => {
  try {
    const {id} = params
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST + `/${id}`;
    console.log(URL)
    const { data } = await deleteRequest({ API: URL });
    return data;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const addPropertyToFavouriteList = async (body: {
  listId: string;
  propertyId: string;
  resetForm?: any
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

export const removePropertyFromFavoriteList = async (params: { id: string }) => {
  try {
    const { id } = params;
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST_PROPERTY + `/${id}`;
    console.log(URL);
    const { data } = await deleteRequest({ API: URL });
    return data;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const updateFavouriteList = async (payload: {id:string ,body: {name: string }}) => {
  try {
    const {id, body} = payload
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST+`/${id}`;
    const { data } = await putRequest({
      API: URL,
      DATA: body,
    });
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};