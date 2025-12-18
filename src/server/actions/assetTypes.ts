"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { CACHE_TIMES } from "@/shared/Constants";
import { sanitizeStrapiData } from "@/shared/Utilies";

export const fetchAssetTypeBySlug = async (props: { slug: string }) => {
  try {
    const { slug } = props;
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.ASSET_TYPES + filter;
    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.STATIC_FILTERS },
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch asset type by slug");
    }
    const json = await response.json();
    return sanitizeStrapiData(json?.data);
  } catch (e) {
    console.log(e, "fetchAssetTypeBySlug error");
  }
};

export const fetchAssetTypes = async () => {
  try {
    const URL =
      API_BASE_URL +
      API_ENPOINTS.ASSET_TYPES +
      `?pagination[page]=1&pagination[pageSize]=50&fields[0]=name&fields[1]=slug&populate=category`;
    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.STATIC_FILTERS },
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch asset types");
    }
    const json = await response.json();
    return sanitizeStrapiData(json?.data);
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
    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.STATIC_FILTERS },
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch popular asset types");
    }
    const json = await response.json();
    return sanitizeStrapiData(json?.data);
  } catch (e) {
    console.log(e, "fetchAssetTypes error");
  }
};
