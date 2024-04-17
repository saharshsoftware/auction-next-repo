import moment from "moment";
import { IActionResponse } from "../interfaces/RequestInteface";
import { STORE_KEY } from "../zustandStore/store";
import { IAuction, IBanks, ICategoryCollection, ILocations } from "@/types";
import { AxiosError } from "axios";
import { STRING_DATA } from "./Constants";
import { ROUTE_CONSTANTS } from "./Routes";

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
  console.log(!encodedString, "encodedString");
  const data = !!encodedString ? JSON.parse(atob(encodedString)) : "";
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
      // debugger;
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
  let formattedPrice: string;

  if (price >= 10000000) {
    // If price is greater than or equal to 1 crore (10,000,000)
 formattedPrice =
   (price / 10000000).toFixed(2).toLocaleString() +
   " Cr";
  } else if (price >= 100000) {
    // If price is greater than or equal to 1 lakh (100,000)
    formattedPrice =
      (price / 100000)
        .toFixed(2)
        .toLocaleString() + " Lakh";
  } else {
    formattedPrice = price.toLocaleString();
  }
  return `₹ ${formattedPrice}`;
};

export const formattedDate = (data: string | Date) =>
  moment(data)?.format("D MMM, YYYY h:mm A");
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
    slug: item?.slug
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
  initialValueData: { category?: string }
) => {
  // console.log(data, "categegory");
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


export const sanitizeStrapiImageUrl = (item:any) => {
  const imagelink = item?.image?.data?.attributes?.url
  const result = process.env.NEXT_PUBLIC_API_BASE_URL + imagelink;
  // console.log(result, "resultimagebank");
  return result
}

export const hasNonEmptyOrNullValue = (obj: any) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] !== "" || obj[key] !== null)) {
        return false; // Found a non-empty and non-null value
      }
    }
    return true;
};

export function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((word: string) => word.charAt(0).toUpperCase())
    .join("");
}

export function capitalizeFirstLetter(str:string) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export function convertString(str1:string) {
  return str1
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getSharedAuctionUrl(item: any) {
  const news_share_path = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.AUCTION_DETAIL}/${item?.slug}`;
  return news_share_path;
}