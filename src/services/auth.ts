import { ILogin, ISignup } from "@/interfaces/Auth";
import { API_BASE_URL, API_ENPOINTS } from "@/services/api";
import { deleteRequest, postRequest } from "@/shared/Axios";
import { COOKIES } from "@/shared/Constants";
import { IUserData } from "@/types";
import { setCookie, deleteCookie } from "cookies-next";

export const signupClient = async (payload: ISignup) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.SIGNUP;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: formData,
    });
    console.log(data);
    const { jwt, user } = data as IUserData;
    setCookie(COOKIES.TOKEN_KEY, jwt);
    setCookie(COOKIES.AUCTION_USER_KEY, JSON.stringify(user));
    return data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const loginClient = async (payload: ILogin) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.LOGIN;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: formData,
    });
    const { jwt, user } = data as IUserData;
    setCookie(COOKIES.TOKEN_KEY, jwt);
    setCookie(COOKIES.AUCTION_USER_KEY, JSON.stringify(user));
    return data;
  } catch (error: any) {
    throw error.response.data?.error;
  }
};

export async function logout() {
  deleteCookie(COOKIES.TOKEN_KEY);
  deleteCookie(COOKIES.AUCTION_USER_KEY);
}

export const changePasswordServiceClient = async (body: {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}) => {
  try {
    const URL = API_BASE_URL + API_ENPOINTS.CHANGE_PASSWORD;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: body,
    });
    console.log(data, "change-data");
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const deleteUserAccount = async () => {
  try {
    const URL = API_ENPOINTS.USER_ME;
    const { data } = await deleteRequest({
      API: URL,
    });
    return data;
  } catch (error: any) {
    throw error.response.data?.error;
  }
};

export const sendSignInOtpClient = async (payload: { email: string }) => {
  const { email } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.SEND_SIGNIN_OTP;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: { email },
    });
    return data;
  } catch (error: any) {
    throw error.response.data?.error;
  }
};

export const signupCustomClient = async (payload: ISignup) => {
  const { formData } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.SIGNUP_CUSTOM;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: formData,
    });
    return data;
  } catch (error: any) {
    throw error.response.data?.error;
  }
};

export const siginUsingOtpClient = async (payload: { email: string, otp: string }) => {
  const { email, otp } = payload;
  try {
    const URL = API_BASE_URL + API_ENPOINTS.SIGNIN_USING_OTP;
    console.log(URL);
    const { data } = await postRequest({
      API: URL,
      DATA: { email, otp },
    });
    const { jwt, user } = data as IUserData;
    setCookie(COOKIES.TOKEN_KEY, jwt);
    setCookie(COOKIES.AUCTION_USER_KEY, JSON.stringify(user));
    return data;
  } catch (error: any) {
    throw error.response.data?.error;
  }
};
