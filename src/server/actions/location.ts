"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { FILTER_API_REVALIDATE_TIME } from "@/shared/Constants";
import { generateQueryParamString, sanitizeStrapiData } from "@/shared/Utilies";

export const fetchLocation = async () => {
  "use server";
  try {
    const requiredkeys = generateQueryParamString([
      "slug",
      "name",
      "type",
      "state",
    ]);
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&${requiredkeys}`;
    const URL = API_BASE_URL + API_ENPOINTS.LOCATIONS + filter;

    const response = await fetch(URL, {
      next: { revalidate: FILTER_API_REVALIDATE_TIME },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const responseResult = await response.json();
    return sanitizeStrapiData(responseResult?.data);
  } catch (e) {
    console.error(e, "locations-server error");
    return null;
  }
};

export const fetchLocationBySlug = async (props: { slug: string }) => {
  try {
    const { slug } = props;
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.LOCATIONS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location-detail error");
  }
};

export const fetchPopularLocations = async () => {
  "use server";
  try {
    const filter = `?sort[0]=name:asc&filters[$and][0][isPopular]=true&pagination[page]=1&pagination[pageSize]=5`;
    const URL = API_BASE_URL + API_ENPOINTS.POPULAR_LOCATIONS + filter;

    const response = await fetch(URL, {
      next: { revalidate: FILTER_API_REVALIDATE_TIME },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const responseResult = await response.json();
    return sanitizeStrapiData(responseResult?.data);
  } catch (e) {
    console.error(e, "locations-server error");
    return null;
  }
};
