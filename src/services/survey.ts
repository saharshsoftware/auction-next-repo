"use client";

import { postRequest } from "@/shared/Axios";
import { API_BASE_URL, API_ENPOINTS } from "./api";

export const userSurveys = async (body: {
  ipAddress: string;
  user: string;
  answer: any;
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
    return e;
  }
};
