"use server";
import { ILogin, ISignup } from "@/interfaces/Auth";
import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { postRequest } from "@/shared/Axios";
import { COOKIES } from "@/shared/Constants";
import { IUserData } from "@/types";
// import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
 

export const signup = async (payload: ISignup) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.SIGNUP;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: formData,
    });
    console.log(data)
    const {jwt, user} = data as IUserData
    cookies().set(COOKIES.TOKEN_KEY, jwt);
    cookies().set(COOKIES.AUCTION_USER_KEY, JSON.stringify(user));
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const login = async (payload: ILogin) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.LOGIN;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: formData,
    });
    const { jwt, user } = data as IUserData;
    cookies().set(COOKIES.TOKEN_KEY, jwt);
    cookies().set(COOKIES.AUCTION_USER_KEY, JSON.stringify(user));
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export async function logout() {
  cookies().delete(COOKIES.TOKEN_KEY);
  cookies().delete(COOKIES.AUCTION_USER_KEY);
};


