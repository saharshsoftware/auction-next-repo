import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { sanitizeStrapiData } from "@/shared/Utilies";

export const fetchBankTopClient = async () => {
  try {
    const filter = `?filters[$and][0][isPopular]=true&pagination[page]=1&pagination[pageSize]=5`;
    const URL = API_BASE_URL + API_ENPOINTS.TOP_BANKS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data, true);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const fetchCategoriesTopClient = async () => {
  try {
    const filter = `?filters[$and][0][isPopular]=true&pagination[page]=1&pagination[pageSize]=5`;
    const URL = API_BASE_URL + API_ENPOINTS.CATEGORY_BOX_COLLETIONS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const fetchPopularBankClient = async () => {
  try {
    const filter = `?filters[$and][0][isPopular]=true&pagination[page]=1&pagination[pageSize]=5`;
    const URL = API_BASE_URL + API_ENPOINTS.POPULAR_BANKS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};
