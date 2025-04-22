import { IActionResponse } from "../interfaces/RequestInteface";
import { STORE_KEY } from "../zustandStore/store";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { AxiosError } from "axios";
import { getEmptyAllObject, STORAGE_KEYS, STRING_DATA } from "./Constants";
import { ROUTE_CONSTANTS } from "./Routes";
import MarkdownIt from "markdown-it";

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
  const { message } = actionResponse?.data?.error ?? actionResponse?.data ?? {};
  // debugger;
  if (message) {
    if (actionResponse?.fail) {
      // debugger;
      actionResponse?.fail?.(
        actionResponse?.data?.error ??
          actionResponse?.data?.response?.data?.error
      );
      return;
    }
  } else {
    actionResponse?.success?.(actionResponse?.data);
  }
};

export const formatPrice = (price: any) => {
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice) || numericPrice < 0) return "Invalid price"; // Ensure valid number

  let formattedPrice: string;
  if (numericPrice >= 1_00_00_000) {
    formattedPrice = `${(numericPrice / 1_00_00_000).toFixed(2)} Cr`;
  } else if (numericPrice >= 1_00_000) {
    formattedPrice = `${(numericPrice / 1_00_000).toFixed(2)} Lakh`;
  } else {
    formattedPrice = numericPrice.toLocaleString();
  }

  return `₹ ${formattedPrice}`;
};

export const formattedDate = (data: string | Date) => {
  if (!data) return ""; // Avoid errors for undefined/null input

  const date = new Date(data);
  if (isNaN(date.getTime())) return "Invalid Date"; // Prevent invalid date errors

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Ensures consistent SSR and CSR rendering
  }).format(date);
};

export const formattedDateAndTime = (data?: string | Date | null): string => {
  // Handle empty/undefined cases first
  if (!data) return "Not mentioned";

  try {
    // Create date object - works for both strings and Date objects
    const date = new Date(data);

    // Validate the date
    if (isNaN(date.getTime())) {
      console.warn("Invalid date input:", data);
      return "Invalid date";
    }

    // Use the same reliable formatting as your working version
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // <- Critical for consistent behavior
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Date unavailable";
  }
};

const formatValidDate = (date: Date): string => {
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr}, ${timeStr}`;
};

export const sanitizedAuctionData = (data: any[]) => {
  return data.map((item: any) => ({ id: item.id, ...item.attributes }));
};

export const sanitizedAuctionDetail = (data: any) => {
  const { assetCategory, assetType, contactNo, contact, area, city, state } =
    data?.attributes;
  const result = { id: data.id, ...data.attributes };
  result.propertyType = `${assetCategory ?? "-"} - ${assetType ?? ""}`;
  result.contact = `${contact ?? ""} ${contactNo ?? ""}`;
  result.area = `${area ?? ""}, ${city ?? ""}, ${state ?? ""}`;
  // console.log(result, "santizied")
  return result;
};

export const santizedErrorResponse = (error: any) => {
  const response = error?.data?.error;
  return { axiosError: response?.message, responseError: response?.details };
};

export const sanitizeStrapiData = (
  data: any,
  isStrapiDefaultResponse?: boolean
) => {
  if (isStrapiDefaultResponse) {
    const sanitizeData = data?.map((item: any) => ({
      id: item?.id,
      ...item?.attributes,
    }));
    return sanitizeData;
  }
  return data;
};

export const sanitizeReactSelectOptions = (data: any[]) => {
  const sanitizeData = data?.map((item: any) => ({
    ...item,
    id: item?.id,
    name: item?.name,
    slug: item?.slug,
    label: item?.name,
    value: item?.id,
  }));
  return sanitizeData;
};

export const sanitizeReactSelectOptionsPage = (data: any[]) => {
  const sanitizeData =
    data?.map((item: any) => ({
      ...item,
      id: item?.id,
      name: item?.name,
      slug: item?.slug,
      label: item?.name,
      value: item?.id,
    })) || [];
  return [getEmptyAllObject(), ...sanitizeData];
};

export const getCategoryOptions = (data: ICategoryCollection[]) => {
  const sanitizeData = data?.map((item: ICategoryCollection) => ({
    // ...item,
    id: item?.id,
    name: item?.name,
    slug: item?.slug,
    label: item?.name,
    value: item?.id,
  }));
  return sanitizeData;
};

export const getLocationOptions = (data: ILocations[]) => {
  const sanitizeData = data?.map((item: ILocations) => ({
    // ...item,
    value: item?.id,
    label: item?.name,
  }));
  return sanitizeData;
};

export const getBankOptions = (data: IBanks[]) => {
  const sanitizeData = data?.map((item: IBanks) => ({
    // ...item,
    id: item?.id,
    name: item?.name,
    slug: item?.slug,
    label: item?.name,
    value: item?.id,
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

export const selectedAssetTypeCategory = (
  data: IAssetType[],
  initialValueData: { propertyType?: string }
) => {
  // console.log(data, "categegory");
  if (data?.length) {
    const result =
      data?.find(
        (item: any) => item?.name === initialValueData?.propertyType
      ) ?? {};
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

export const sanitizeStrapiImageUrl = (item: any) => {
  const imagelink = item?.imageURL;
  // console.log(item, "resultimagebank");
  const result = imagelink
    ? process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT + imagelink
    : "";
  return result;
};

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

export function capitalizeFirstLetter(str: string) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export function convertString(str1: string) {
  return str1
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getSharedAuctionUrl(item: any) {
  const news_share_path = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${ROUTE_CONSTANTS.AUCTION_SLASH}/${item?.slug}`;
  return news_share_path;
}

export function groupByState(data: ILocations[]) {
  // console.log(data)
  const stateToCitiesMap: any = {};

  const cities = data?.filter((item: ILocations) => item.type === "city");
  const states = data?.filter((item: ILocations) => item.type === "state");

  cities?.forEach((city: ILocations) => {
    const stateName = city?.state;
    if (stateName) {
      if (!stateToCitiesMap[stateName]) {
        stateToCitiesMap[stateName] = [];
      }
      stateToCitiesMap[stateName].push(city);
    }
  });

  const resultArray = states?.map((state: ILocations) => {
    const stateName = state?.name || "";
    return {
      ...state, // spread state attributes
      cities: stateToCitiesMap[stateName] || [], // the array of cities
    };
  });

  return resultArray;
}

type GroupedBanks = {
  [key: string]: IBanks[];
};

export function groupAndSortBanks(data: IBanks[]) {
  // Initialize an object to group banks by the first letter of their bankName
  const bankGroups: GroupedBanks = {};

  // Group banks by the first letter of their bankName
  data?.forEach((bank: IBanks, index) => {
    const firstLetter = bank?.name?.charAt(0).toUpperCase() || "";
    if (!bankGroups[firstLetter]) {
      bankGroups[firstLetter] = [];
    }
    bankGroups[firstLetter].push(bank);
  });

  // Convert the object to an array of [key, value] pairs and sort it by key (alphabetically)
  const sortedGroups = Object.entries(bankGroups).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return sortedGroups;
}

export function generateQueryParamString(arr: any, paramName = "fields") {
  return arr
    .map((value: any, index: number) => `${paramName}[${index}]=${value}`)
    .join("&");
}

export const getAuctionFilterRequiredKey = (key: string) => {
  let result = "";
  switch (key) {
    case "locations":
      result = "location";
      break;
    case "banks":
      result = "bank";
      break;
    case "categories":
      result = "category";
      break;
    case "types":
      result = "propertyType";
      break;
  }
  return result;
};

export const getPathType = (path: string): string | null => {
  // Split the path into segments based on '/'
  const segments = path.split("/").filter(Boolean);

  // Check the first segment to determine the type
  switch (segments[0]) {
    case "locations":
      return "location";
    case "banks":
      return "bank";
    case "categories":
      return "category";
    case "types":
      return "propertyType";
    case "prices":
      return "price";
    default:
      return ""; // If none of the cases match
  }
};

export function extractKeywords(
  items: any[],
  label: string,
  slugCategoryName: string
): string[] {
  if (!items) return [];
  const result =
    items?.find((item: any) => {
      const categoryName = item?.category?.data?.attributes?.name || "";

      if (categoryName === slugCategoryName) {
        return item;
      }
    })?.name ?? "";
  // console.log(result, "result", { items });
  return result ? [`${result} ${label}`] : [];
}

export function extractOnlyKeywords(
  items: any[] = [],
  slugCategoryName: string
): string[] {
  if (!Array.isArray(items) || !slugCategoryName) return [];

  const result = items
    .filter((item) => item?.category?.name === slugCategoryName)
    .map((item) => item?.name);

  // console.log(result, "resultextractOnlyKeywords", {
  //   itemslength: result.length,
  //   items,
  // });
  return result;
}

export const handleFilterAssetTypeChange = (
  selectedCategorySlug: string,
  AssetTypeData: IAssetType[]
) => {
  const result = AssetTypeData?.filter(
    (item: IAssetType) =>
      item?.category?.data?.attributes?.slug === selectedCategorySlug
  );
  return result;
};

export const resetFormValues = (
  keyName: string,
  setFieldValue: any,
  setAuctionFilter: any,
  filterData: any
) => {
  setFieldValue(keyName, getEmptyAllObject());
  setAuctionFilter({
    ...filterData,
    keyName: STRING_DATA.EMPTY,
  });
};

export const doesAssetTypeExistInFilteredAssetType = (
  assetsTypes: IAssetType[],
  selectedAssetType: IAssetType
) => {
  return (
    assetsTypes?.findIndex(
      (item: IAssetType) => item?.name === selectedAssetType?.name
    ) !== -1
  );
};

export async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Error checking image URL:", error);
    return false;
  }
}

export const handleOgImageUrl = async (imageUrl: string) => {
  const cloudfrontBase = process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "";
  const actualImageUrl = `${cloudfrontBase}${imageUrl}`;

  // Fallback image URL
  const fallbackImageUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;

  // Check if actualImageUrl is accessible
  const isAccessible = await isImageAccessible(actualImageUrl);
  const sanitizeImageUrl = isAccessible ? actualImageUrl : fallbackImageUrl;

  return sanitizeImageUrl;
};

export const getIPAddress = async () => {
  try {
    // Get user's IP address using ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ipAddress = data.ip;
    return ipAddress;
  } catch (error) {
    console.log("Error submitting form:", error);
  }
};

export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = crypto.randomUUID(); // Generates a unique ID
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

export const getPrimaryBankName = (
  name: string,
  secondarySlug: string,
  matchingSlug: string
) => {
  return secondarySlug === matchingSlug ? secondarySlug?.toUpperCase() : name;
};

export const getCategorySpecificAssets = (props: {
  response: IAssetType[];
  params: { slugcategory?: string; slug?: string };
  isBankCategoriesRoute: boolean;
  isCategoryRoute: boolean;
}) => {
  const { response, params, isBankCategoriesRoute, isCategoryRoute } = props;
  const result = response
    ?.filter((item: any) => {
      // const categoryName = item?.category?.data?.attributes?.slug || "";
      const categoryName = item?.category?.slug || "";

      if (categoryName === params?.slugcategory && isBankCategoriesRoute) {
        return item;
      }

      if (categoryName === params?.slug && isCategoryRoute) {
        return item;
      }
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name || "")); // Sorting alphabetically
  return result ?? [];
};

export const getCleanedTitle = (title: string) => {
  return title.replace(/^.*?\s+Auctions\s+for\s+/, "");
};

export const getDynamicHeight = (text: string) => {
  const length = text.length;
  console.log("length", length, text.length);
  if (length < 40) return "md:h-[45px] h-[75px] "; // Short titles (1-40 chars)
  if (length < 80) return "h-[60px]"; // Medium titles (41-80 chars)
  return "h-[80px]"; // Long titles (>80 chars)
};

export const getAuctionCardDynamicHeight = (text: string) => {
  const length = text.length;

  if (length < 40) return "md:h-[40px] h-[60px]"; // Short titles (1-40 chars)
  if (length < 80)
    return "sm:h-[40px] h-[80px] md:h-[50px] lg:h-[30px] lg:bg-red-600 md:bg-blue-600 bg-yellow-600"; // Medium titles (41-80 chars)
  if (length < 120) return "md:h-[60px] h-[100px]"; // Long titles (81-120 chars)
  return "md:h-[80px] h-[120px]"; // Extra-long titles (>120 chars)
};

export const sanitizeCategorytitle = (categoryName: string) => {
  if (categoryName === "Vehicle Auctions" || categoryName === "Gold Auctions") {
    return `${categoryName}  Properties in India | Find ${categoryName} `;
  }
  return `${categoryName} Bank Auction Properties in India | Find ${categoryName} Auctions`;
};

export const sanitizeCategorySEOH1title = (categoryName: string) => {
  if (categoryName === "Vehicle Auctions" || categoryName === "Gold Auctions") {
    return `${categoryName}  Properties in India  `;
  }
  return `${categoryName} Bank Auction Properties  in India`;
};

// Function to decode data from query parameters
export const getDataFromQueryParamsMethod = (queryParam: string) => {
  if (queryParam) {
    const decodedData = atob(queryParam);
    return JSON.parse(decodedData);
  }
  return null;
};

export const sanitizeCategoryTypeTitle = (
  categoryName: string,
  assetData: IAssetType,
  isMetaDataTitle?: boolean
) => {
  if (
    categoryName === "Gold Auctions" &&
    assetData?.pluralizeName === "Gold Auctions"
  ) {
    return `${categoryName} in India ${
      isMetaDataTitle ? `| Find ${assetData?.name} ` : ""
    }`;
  }

  if (
    categoryName === "Vehicle Auctions" &&
    assetData?.pluralizeName === "Vehicle Auctions"
  ) {
    return `${categoryName} in India ${
      isMetaDataTitle ? `| Find ${assetData?.name} ` : ""
    }`;
  }

  if (
    categoryName === "Vehicle Auctions" &&
    assetData?.pluralizeName !== "Vehicle Auctions"
  ) {
    return `${categoryName} ${assetData?.pluralizeName} in India ${
      isMetaDataTitle ? `| Find ${assetData?.name} ` : ""
    }`;
  }

  const title = `${categoryName} ${
    assetData?.pluralizeName
  } Auctions in India ${
    isMetaDataTitle ? `| Find ${assetData?.name} Auctions` : ""
  }`;

  return title
    .split(/\s+/)
    .reduce((acc: string[], word) => {
      if (acc.length === 0 || acc[acc.length - 1] !== word) {
        acc.push(word);
      }
      return acc;
    }, [])
    .join(" ");
};

export const renderMarkdown = (markdown: any) => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
  });
  return md.render(markdown);
};
