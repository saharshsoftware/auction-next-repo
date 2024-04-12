import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/shared/Axios";

export const fetchFavoriteListClient = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST;
    const { data } = await getRequest({ API: URL });
    return data;
  } catch (e) {
    console.log(e, "fetchfav error");
  }
};

export const createFavouriteListClient = async (body: {name: string}) => {
  try {
    const URL =  API_ENPOINTS.FAVOURITE_LIST+ '/create';
    const { data } = await postRequest({
      API: URL,
      DATA: body,
    });    
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const fetchFavoriteListPropertyClient = async (params: { listId: string }) => {
  try {
    const { listId } = params;
    const URL =
      API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST_PROPERTY + `?listId=${listId}`;
    const { data } = await getRequest({ API: URL });
    console.log(data, "propertydata")
    return data;
  } catch (e) {
    console.log(e, "fetchfavourite error");
  }
};

export const deleteFavoriteListClient = async (params: { id: string }) => {
  try {
    const {id} = params
    const URL = API_BASE_URL + API_ENPOINTS.FAVOURITE_LIST + `/${id}`;
    console.log(URL)
    const { data } = await deleteRequest({ API: URL });
    return data;
  } catch (e) {
    console.log(e, "delete error");
  }
};

export const addPropertyToFavouriteListClient = async (body: {
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

export const removePropertyFromFavoriteListClient = async (params: { id: string }) => {
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

export const updateFavouriteListClient = async (payload: {id:string ,body: {name: string }}) => {
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