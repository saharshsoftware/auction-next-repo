"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { sanitizeStrapiData } from "@/shared/Utilies";

export const fetchLocation = async () => {
  try {
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000`;
    const URL = API_BASE_URL + API_ENPOINTS.LOCATIONS+filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const fetchLocationBySlug = async (props: {slug:string}) => {
  try {
    const { slug } = props;
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.LOCATIONS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};
