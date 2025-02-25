"use client";

import { getRequest, postRequest, putRequest } from "@/shared/Axios";
import { API_BASE_URL, API_ENPOINTS } from "./api";
import { getIPAddress } from "@/shared/Utilies";

export const userSurveys = async (body: {
  ipAddress: string;
  user: string;
  answers?: any;
  survey: string;
  status: "COMPLETED" | "REMIND_LATER";
}) => {
  try {
    // const URL = API_BASE_URL + API_ENPOINTS.INTEREST;
    const URL = "http://localhost:1009" + API_ENPOINTS.USER_SURVEYS;
    const { data } = await postRequest({ API: URL, DATA: { data: body } });

    console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    throw e;
  }
};

export const updateUserSurveys = async (payload: {
  body: {
    ipAddress: string;
    user: string;
    answers?: any;
    survey: string;
    status: "COMPLETED" | "REMIND_LATER";
  };
  userSurveyId: string;
}) => {
  const { body, userSurveyId } = payload;
  try {
    // const URL = API_BASE_URL + API_ENPOINTS.USER_SURVEYS + `/${userSurveyId}`;
    const URL =
      "http://localhost:1009" + API_ENPOINTS.USER_SURVEYS + `/${userSurveyId}`;
    const { data } = await putRequest({ API: URL, DATA: { data: body } });

    // console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    throw e;
  }
};

export const getActiveSurvey = async () => {
  try {
    const filter = `?filters[isActive][$eq]=true`;
    // const URL = API_BASE_URL + API_ENPOINTS.INTEREST+filter;
    const URL = "http://localhost:1009" + API_ENPOINTS.SURVEYS + filter;
    const { data } = await getRequest({ API: URL });

    // console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    return e;
  }
};

export const getIPAddressSurveyStatus = async (surveyId: string) => {
  try {
    const ipAddress = await getIPAddress();
    const filter = `?filters[ipAddress][$eq]=${ipAddress}&filters[survey][id][$eq]=${surveyId}`;
    // const URL = API_BASE_URL + API_ENPOINTS.INTEREST+filter;
    const URL = "http://localhost:1009" + API_ENPOINTS.USER_SURVEYS + filter;
    const { data } = await getRequest({ API: URL });

    // console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    return e;
  }
};
