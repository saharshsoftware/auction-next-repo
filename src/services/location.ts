import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { generateQueryParamString, sanitizeStrapiData } from "@/shared/Utilies";

export const fetchLocationTopClient = async () => {
  try {
    const filter = `?sort[0]=name:asc&filters[$and][0][isPopular]=true&pagination[page]=1&pagination[pageSize]=5`;
    const URL = API_BASE_URL + API_ENPOINTS.LOCATIONS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};

export const fetchLocationClient = async () => {
  try {
    const requiredkeys = generateQueryParamString(["name", "slug"]);
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&${requiredkeys}`;
    const URL = API_BASE_URL + API_ENPOINTS.LOCATIONS+filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "location error");
  }
};
