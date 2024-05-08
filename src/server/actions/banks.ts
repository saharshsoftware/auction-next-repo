"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { generateQueryParamString, sanitizeStrapiData } from "@/shared/Utilies";

export const fetchBanks = async () => {
  try {
    const requiredkeys = generateQueryParamString(['name', 'slug']);
    // console.log(requiredkeys, "requiredkeys");
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&${requiredkeys}`;
    const URL = API_BASE_URL + API_ENPOINTS.BANKS+filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "banks error");
  }
};

export const fetchBanksBySlug = async (props: {slug:string}) => {
  try {
    const { slug }= props
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&filters[slug][$eq]=${slug}`;
    const URL = API_BASE_URL + API_ENPOINTS.BANKS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "banks error");
  }
};

