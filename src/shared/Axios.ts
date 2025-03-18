import { IRequest } from "@/interfaces/RequestInteface";
import { API_BASE_URL } from "@/services/api";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import { COOKIES } from "./Constants";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config: any) => {
    const token = getCookie(COOKIES.TOKEN_KEY);
    if (!!token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    // config.headers["accept-encoding"] = "gzip;q=1, br;q=0.8, *;q=0.1";
    // config.headers["saurabh"] = "kh";
    // config.headers["content-encoding"] = "gzip;q=1, br;q=0.8, *;q=0.1";
    // console.log(config.headers, "configuser>>");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getRequest = async ({ API = "" }: IRequest) => {
  return instance.get(API);
};

export const postRequest = async ({ API = "", DATA = {} }: IRequest) => {
  return instance.post(API, DATA);
};

export const putRequest = async ({ API = "", DATA = {} }: IRequest) => {
  return instance.put(API, DATA);
};

export const deleteRequest = async ({ API = "", DATA = {} }: IRequest) => {
  return instance.delete(API, { data: DATA });
};
