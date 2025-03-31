"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { sanitizeStrapiData } from "@/shared/Utilies";

export const fetchAssetTypeBySlug = async (props: { slug: string }) => {
  try {
    const { slug } = props;
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.ASSET_TYPES + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "fetchAssetTypeBySlug error");
  }
};

export const fetchAssetTypes = async () => {
  try {
    const URL =
      API_BASE_URL +
      API_ENPOINTS.POPULER_ASSET_TYPES +
      `?pagination[page]=1&pagination[pageSize]=50&fields[0]=name&fields[1]=slug&populate=category`;
    console.log("URL", URL);
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "fetchAssetTypes error");
  }
};

export const fetchPopularAssetTypes = async () => {
  try {
    const URL =
      API_BASE_URL +
      API_ENPOINTS.POPULER_ASSET_TYPES +
      `?pagination[page]=1&pagination[pageSize]=50&fields[0]=name&fields[1]=slug&populate=category`;
    console.log("URL", URL);
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "fetchAssetTypes error");
  }
};
