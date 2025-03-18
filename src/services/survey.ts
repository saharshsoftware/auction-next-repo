"use client";
import { API_BASE_URL, API_ENPOINTS } from "./api";
import { getIPAddress, getOrCreateDeviceId } from "@/shared/Utilies";
import axios from "axios";

export const userSurveys = async (body: {
  ipAddress: string;
  user: string;
  answers?: any;
  survey: string;
  status: "COMPLETED" | "REMIND_LATER";
}) => {
  try {
    const ipAddress = await getIPAddress();
    const URL = API_BASE_URL + API_ENPOINTS.USER_SURVEYS;
    const { data } = await axios.post(URL, {
      data: { ...body, ipAddress },
      headers: {},
    });

    // console.log(data, "responsefetch");
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
    const ipAddress = await getIPAddress();
    const URL = API_BASE_URL + API_ENPOINTS.USER_SURVEYS + `/${userSurveyId}`;
    const { data } = await axios.put(URL, { data: { ...body, ipAddress } });

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
    const filter = `?filters[isActive][$eq]=true&pagination[page]=1&pagination[pageSize]=1`;
    const URL = API_BASE_URL + API_ENPOINTS.SURVEYS + filter;
    const { data } = await axios.get(URL, {
      headers: {},
    });

    // console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    return e;
  }
};

export const getIPAddressSurveyStatus = async (props: {
  surveyId: string;
  isAuthenticated: boolean;
  userId: string | null;
}) => {
  try {
    const { surveyId, isAuthenticated, userId } = props;
    // const ipAddress = await getIPAddress();
    const deviceId = getOrCreateDeviceId();
    // filters[user][id][$eq]=1
    let filter = `?pagination[page]=1&pagination[pageSize]=1&filters[survey][id][$eq]=${encodeURI(
      surveyId
    )}&`;

    if (isAuthenticated) {
      filter += `filters[user][id][$eq]=${encodeURI(userId || "")}`;
    } else {
      filter += `filters[deviceId][$eq]=${encodeURI(deviceId)}`;
    }
    // else {
    //   filter += `filters[ipAddress][$eq]=${encodeURI(ipAddress)}`;
    // }

    const URL = API_BASE_URL + API_ENPOINTS.USER_SURVEYS + filter;
    const { data } = await axios.get(URL);

    // console.log(data, "responsefetch");
    return data;
  } catch (e: any) {
    // return e?.response?.data?.error?.message
    console.log(e, "auctionDetail error collection");
    return e;
  }
};
