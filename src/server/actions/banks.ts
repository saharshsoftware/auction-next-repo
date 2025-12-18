"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { CACHE_TIMES } from "@/shared/Constants";
import { generateQueryParamString, sanitizeStrapiData } from "@/shared/Utilies";

export const fetchBanks = async () => {
  "use server";
  try {
    const requiredkeys = generateQueryParamString(["name", "slug", "sortOrder", "secondarySlug"]);
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&${requiredkeys}`;
    const URL = API_BASE_URL + API_ENPOINTS.BANKS + filter;

    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.STATIC_FILTERS },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch banks");
    }

    const responseResult = await response.json();
    return sanitizeStrapiData(responseResult?.data);
  } catch (e) {
    console.error(e, "Banks error");
    return null;
  }
};

export const fetchBanksBySlug = async (props: { slug: string }) => {
  try {
    const { slug } = props;
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&filters[$or][0][slug][$eq]=${slug}&filters[$or][1][secondarySlug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.BANKS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "banks error");
  }
};

export const fetchPopularBanks = async () => {
  try {
    const filter = `?filters[$and][0][isPopular]=true&pagination[page]=1&pagination[pageSize]=5`;
    const URL = API_BASE_URL + API_ENPOINTS.POPULAR_BANKS + filter;

    const response = await fetch(URL, {
      next: { revalidate: CACHE_TIMES.STATIC_FILTERS },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch banks");
    }

    const responseResult = await response.json();
    const sendResponse = sanitizeStrapiData(responseResult?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};
