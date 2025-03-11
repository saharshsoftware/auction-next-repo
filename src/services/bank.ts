import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { generateQueryParamString, sanitizeStrapiData } from "@/shared/Utilies";

export const fetchBanksClient = async () => {
  try {
    const requiredkeys = generateQueryParamString([
      "name",
      "slug",
      "secondarySlug",
    ]);
    const filter = `?sort[0]=name:asc&pagination[page]=1&pagination[pageSize]=1000&${requiredkeys}`;
    const URL = API_BASE_URL + API_ENPOINTS.BANKS + filter;
    const { data } = await getRequest({ API: URL });
    const sendResponse = sanitizeStrapiData(data?.data);
    return sendResponse;
  } catch (e) {
    console.log(e, "banks error");
  }
};
