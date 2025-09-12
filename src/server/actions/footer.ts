"use server";

import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { getRequest } from "@/shared/Axios";
import { sanitizeStrapiData } from "@/shared/Utilies";

export const getPrivacyData = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.PRIVACY_POLICY;
    const { data } = await getRequest({ API: URL });
    const sendResponse = { id: data?.data?.id, ...data?.data?.attributes };
    return sendResponse;
  } catch (e) {
    console.log(e, "privacy error");
  }
};

export const getFaqData = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.FAQ + '?sort[0]=sortOrder:asc&pagination[page]=1&pagination[pageSize]=100';
    const { data } = await getRequest({ API: URL });
    return sanitizeStrapiData(data?.data, true);
  } catch (e) {
    console.log(e, "faq error");
  }
};

export const getAboutUsData = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.ABOUT_US;
    const { data } = await getRequest({ API: URL });
    const sendResponse = { id: data?.data?.id, ...data?.data?.attributes };
    return sendResponse;
  } catch (e) {
    console.log(e, "aboutus error");
  }
};

export const getTermsAndConditions = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.TERMS;
    const { data } = await getRequest({ API: URL });
    const sendResponse = { id: data?.data?.id, ...data?.data?.attributes };
    return sendResponse;
  } catch (e) {
    console.log(e, "terms&conditions error");
  }
};

export const getContactUsData = async () => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CONTACT_US;
    const { data } = await getRequest({ API: URL });
    const sendResponse = { id: data?.data?.id, ...data?.data?.attributes };
    return sendResponse;
  } catch (e) {
    console.log(e, "contactus error");
  }
};