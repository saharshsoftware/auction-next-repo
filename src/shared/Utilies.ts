import moment from "moment";
import { IActionResponse } from "../interfaces/RequestInteface";
import { STORE_KEY } from "../zustandStore/store";

export const getDataFromLocalStorage = () => {
  const storedData = localStorage.getItem(STORE_KEY);
  return storedData ? JSON.parse(storedData) : null;
}

export const setTokenInLocalStorage = (data:any) => {
  const stringifiedData = JSON.stringify(data);
  localStorage.setItem(STORE_KEY, stringifiedData);
}

export const setDataInQueryParams = (values:any) =>  {
  const data = btoa(JSON.stringify(values))
  return data;
}

export const getDataFromQueryParams = (encodedString:string) =>  {
  const data = JSON.parse(atob(encodedString));
  return data;
}

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
  const { message } = actionResponse?.data ?? {};
  if (message) {
    if (actionResponse?.fail) {
      actionResponse?.fail?.(actionResponse?.data?.response);
      return;
    }
  } else {
    actionResponse?.success?.(actionResponse?.data);
  }
};

export const formatPrice = (price:any) => {
  price = parseFloat(price);
  if (isNaN(price)) {
      return "Invalid price";
  }  
  const formattedPrice = price.toLocaleString('en-US', {
    style: 'decimal',
    // minimumFractionDigits: 2
  });
  return `₹ ${formattedPrice}`;
}

export const formattedDate = (data:string) => moment(data).format("ll");
export const formattedDateAndTime = (data:string) => moment(data).format("MMM Do YYYY, h:mm:ss A");
