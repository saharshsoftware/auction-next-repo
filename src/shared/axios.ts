import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IRequest } from "../interfaces/RequestInteface";
import { API_BASE_URL } from "../services/api";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  (config: any) => {
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

