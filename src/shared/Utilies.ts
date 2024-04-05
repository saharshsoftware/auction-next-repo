import moment from "moment";
import { IActionResponse } from "../interfaces/RequestInteface";
import { STORE_KEY } from "../zustandStore/store";
import { IAuction, IBanks, ICategoryCollection, ILocations } from "@/types";
import { AxiosError } from "axios";

export const getDataFromLocalStorage = () => {
  const storedData = localStorage.getItem(STORE_KEY);
  return storedData ? JSON.parse(storedData) : null;
};

export const setTokenInLocalStorage = (data: any) => {
  const stringifiedData = JSON.stringify(data);
  localStorage.setItem(STORE_KEY, stringifiedData);
};

export const setDataInQueryParams = (values: any) => {
  const data = btoa(JSON.stringify(values));
  return data;
};

export const getDataFromQueryParams = (encodedString: string) => {
  const data = encodedString ? JSON.parse(atob(encodedString)) : "";
  return data;
};

export const handleQueryResponse = (actionResponse: IActionResponse) => {
  const { message } = actionResponse?.data ?? {};
  if (message) {
    console.log(message);
    throw new Error(message);
  } else {
    return actionResponse;
  }
};

export const handleOnSettled = (actionResponse: IActionResponse) => {
  const { message } = actionResponse?.data?.error ?? {};
  if (message) {
    if (actionResponse?.fail) {
      debugger;
      actionResponse?.fail?.(actionResponse?.data?.error);
      return;
    }
  } else {
    actionResponse?.success?.(actionResponse?.data);
  }
};

export const formatPrice = (price: any) => {
  price = parseFloat(price);
  if (isNaN(price)) {
    return "Invalid price";
  }
  const formattedPrice = price.toLocaleString("en-US", {
    style: "decimal",
    // minimumFractionDigits: 2
  });
  return `₹ ${formattedPrice}`;
};

export const formattedDate = (data: string | Date) =>
  moment(data)?.format("ll");
export const formattedDateAndTime = (data: string | Date) =>
  moment(data)?.format("MMM Do YYYY, h:mm:ss A");

export const sanitizedAuctionData = (data: any[]) => {
  return data.map((item: any) => ({ id: item.id, ...item.attributes }));
};

export const sanitizedAuctionDetail = (data: any) => {
  return { id: data.id, ...data.attributes };
};

export const santizedErrorResponse = (error: any) => {
  const response = error?.data?.error;
  return { axiosError: response?.message, responseError: response?.details };
};

export const sanitizeStrapiData = (data: any) => {
  const sanitizeData = data?.map((item: any) => ({
    id: item?.id,
    ...item?.attributes,
  }));
  return sanitizeData;
};

export const getCategoryOptions = (data: ICategoryCollection[]) => {
  const sanitizeData = data?.map((item: ICategoryCollection) => ({
    // ...item,
    id: item?.id,
    name: item?.categoryName,
  }));
  return sanitizeData;
};

export const getBankOptions = (data: IBanks[]) => {
  const sanitizeData = data?.map((item: IBanks) => ({
    // ...item,
    id: item?.id,
    name: item?.bankName,
  }));
  return sanitizeData;
};

export const selectedLocation = (
  data: ILocations[],
  initialValueData: { location?: any }
) => {
  if (data?.length) {
    const result =
      data?.find((item: any) => item?.name === initialValueData?.location) ??
      {};
    return [result];
  }
  return [];
};

export const selectedCategory = (
  data: ICategoryCollection[],
  initialValueData: { category?: any }
) => {
  console.log(data, "categegory");
  if (data?.length) {
    const result =
      data?.find((item: any) => item?.name === initialValueData?.category) ??
      {};
    return [result];
  }
  return [];
};

export const selectedBank = (
  data: IBanks[],
  initialValueData: { bank?: any }
) => {
  if (data?.length) {
    const result =
      data?.find((item: any) => item?.name === initialValueData?.bank) ?? {};
    return [result];
  }
  return [];
};
