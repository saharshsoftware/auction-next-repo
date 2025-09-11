import { IActionResponse } from "../interfaces/RequestInteface";
import {
  IAssetType,
  IAuction,
  IBanks,
  ICategoryCollection,
  ILocations,
  INSTRUCTIONS_FOLDER_NAME,
} from "@/types";
import { AxiosError } from "axios";
import { getEmptyAllObject, STORAGE_KEYS, STRING_DATA } from "./Constants";
import { ROUTE_CONSTANTS } from "./Routes";
import MarkdownIt from "markdown-it";
import { CONFIG } from "@/utilies/Config";
import { USER_TYPE } from "@/types.d";
import { safeArray, safeNumber, safeString } from "@/utilies/imageUtils";

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

// Transform the data structure to match our expected format with safe handling
export const transformProperty = (item: IAuction): IAuction => {
  if (!item || !item.attributes) {
    throw new Error('Invalid property data structure');
  }

  const attrs = item.attributes;
  return {
    id: item.id?.toString() || '0',
    bankName: safeString(attrs.bankName) || "",
    branchName: safeString(attrs.branchName) || "",
    serviceProvider: safeString(attrs.serviceProvider) || "",
    borrowerName: safeString(attrs.borrowerName) || "",
    assetCategory: safeString(attrs.assetCategory) || "",
    auctionType: safeString(attrs.auctionType) || "",
    noticeLink: safeString(attrs.noticeLink) || "",
    authorisedOfficerContactPerson: safeString(attrs.authorisedOfficerContactPerson) || "",
    auctionStartTime: safeString(attrs.auctionStartTime) || "",
    auctionEndDate: safeString(attrs.auctionEndDate) || "",
    applicationSubmissionDate: safeString(attrs.applicationSubmissionDate) || "",
    reservePrice: safeNumber(attrs.reservePrice) || 0,
    emd: safeNumber(attrs.emd) || 0,
    title: safeString(attrs.title) || "",
    contactNo: safeString(attrs.contactNo) || "",
    description: safeString(attrs.description) || "",
    state: safeString(attrs.state) || "",
    city: safeString(attrs.city) || "",
    area: safeString(attrs.area) || "",
    contact: safeString(attrs.contact) || "",
    noticeImageUrl: safeString(attrs.noticeImageUrl) || "",
    slug: safeString(attrs.slug) || "",
    search: safeString(attrs.search) || "",
    estimatedMarketPrice: safeNumber(attrs.estimatedMarketPrice) || 0,
    assetType: safeString(attrs.assetType) || "",
    createdAt: safeString(attrs.createdAt) || "",
    updatedAt: safeString(attrs.updatedAt) || "",
    createdById: attrs.createdById || null,
    updatedById: attrs.updatedById || null,
    sitemapExclude: attrs.sitemapExclude || false,
    owner_name: safeString(attrs.ownerName),
    propertyAddress: safeString(attrs.propertyAddress),
    bankPropertyId: safeString(attrs.bankPropertyId),
    propertyTitleDeedType: safeString(attrs.propertyTitleDeedType),
    propertyOwnerShipType: safeString(attrs.propertyOwnerShipType),
    propertyPossessionType: safeString(attrs.propertyPossessionType),
    residentialDetail: safeString(attrs.residentialDetail),
    commercialDetail: safeString(attrs.commercialDetail),
    industryDetail: safeString(attrs.industryDetail),
    agricultureDetail: safeString(attrs.agricultureDetail),
    pincode: safeString(attrs.pincode),
    dealingOfficerName: safeString(attrs.dealingOfficerName),
    inspectionDateFrom: safeString(attrs.inspectionDateFrom),
    inspectionDateTo: safeString(attrs.inspectionDateTo),
    emdStartDateTime: safeString(attrs.emdStartDateTime),
    emdEndDateTime: safeString(attrs.emdEndDateTime),
    borrowerAddress: safeString(attrs.borrowerAddress),
    incrementPrice: safeNumber(attrs.incrementPrice),
    lat: safeString(attrs.lat),
    lng: safeString(attrs.lng),
    noticeImageURLs: safeArray(attrs.noticeImageURLs) || [],
    inspectionOfficerName: safeString(attrs.inspectionOfficerName),
    inspectionOfficerMobileNo: safeString(attrs.inspectionOfficerMobileNo),
    inspectionBranchAddress: safeString(attrs.inspectionBranchAddress),
    officerNameAndDesignation: safeString(attrs.officerNameAndDesignation),
    extendTimeInMinutes: safeString(attrs.extendTimeInMinutes),
    propertyType: safeString(attrs.propertyType) || "",
    location: safeString(attrs.location) || "",
  };
};

export const sanitizedAuctionData2 = (data: any[]) => {
  return data.map((item: any) => transformProperty(item));
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
    (item: IAssetType) => item?.category?.slug === selectedCategorySlug
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

const OG_IMAGE_VALIDATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const OG_IMAGE_HEAD_TIMEOUT_MS = 600; // short timeout for perf
const ogImageValidationCache: Map<string, { ok: boolean; expiresAt: number }> = new Map();

export async function isImageAccessible(url: string): Promise<boolean> {
  return true;
  // try {
  //   const cached = ogImageValidationCache.get(url);
  //   const now = Date.now();
  //   if (cached && cached.expiresAt > now) {
  //     return cached.ok;
  //   }

  //   const controller = new AbortController();
  //   const timeout = setTimeout(() => controller.abort(), OG_IMAGE_HEAD_TIMEOUT_MS);
  //   const response = await fetch(url, {
  //     method: "HEAD",
  //     cache: "no-store",
  //     redirect: "follow",
  //     signal: controller.signal,
  //   });
  //   clearTimeout(timeout);
  //   const contentLengthHeader = response.headers.get("content-length");
  //   const contentTypeHeader = response.headers.get("content-type") || "";
  //   const parsedLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : NaN;
  //   const hasNonZeroLength = Number.isNaN(parsedLength) ? true : parsedLength > 0;
  //   const isLikelyImage = contentTypeHeader.toLowerCase().startsWith("image/") || contentTypeHeader === "";
  //   const ok = response.ok && hasNonZeroLength && isLikelyImage;
  //   ogImageValidationCache.set(url, { ok, expiresAt: now + OG_IMAGE_VALIDATION_TTL_MS });
  //   return ok;
  // } catch (error) {
  //   // Do not log network timeouts aggressively; cache negative to avoid repeat
  //   ogImageValidationCache.set(url, { ok: false, expiresAt: Date.now() + OG_IMAGE_VALIDATION_TTL_MS });
  //   return false;
  // }
}

export const handleOgImageUrl = async (imageUrl: string) => {
  const fallbackImageUrl = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/images/logo.png`;
  if (!imageUrl) {
    return fallbackImageUrl;
  }

  const isAbsolute = /^(https?:)?\/\//i.test(imageUrl);
  const cloudfrontBase = (process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT || "").replace(/\/$/, "");
  // Build candidate URL (absolute or CDN-joined) then validate fast to catch 0-byte images
  const candidateUrl = isAbsolute
    ? imageUrl
    : (() => {
      const normalizedPath = imageUrl.replace(/^\/+/, "");
      return cloudfrontBase ? `${cloudfrontBase}/${normalizedPath}` : `/${normalizedPath}`;
    })();

  const ok = await isImageAccessible(candidateUrl);
  return ok ? candidateUrl : fallbackImageUrl;
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

export function buildCanonicalUrl(params: {
  baseUrl: string;
  pathname: string; // absolute pathname starting with '/'
  page?: string | string[] | undefined;
}): string {
  const { baseUrl, pathname, page } = params;
  const normalizedBase = baseUrl?.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pageVal = Array.isArray(page) ? page[0] : page;
  const isDefaultPage = !pageVal || pageVal === "1";
  return `${normalizedBase}${path}${isDefaultPage ? "" : `?page=${pageVal}`}`;
}

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
    return `${categoryName} in India ${isMetaDataTitle ? `| Find ${assetData?.name} ` : ""
      }`;
  }

  if (
    categoryName === "Vehicle Auctions" &&
    assetData?.pluralizeName === "Vehicle Auctions"
  ) {
    return `${categoryName} in India ${isMetaDataTitle ? `| Find ${assetData?.name} ` : ""
      }`;
  }

  if (
    categoryName === "Vehicle Auctions" &&
    assetData?.pluralizeName !== "Vehicle Auctions"
  ) {
    return `${categoryName} ${assetData?.pluralizeName} in India ${isMetaDataTitle ? `| Find ${assetData?.name} ` : ""
      }`;
  }

  const title = `${categoryName} ${assetData?.pluralizeName
    } Auctions in India ${isMetaDataTitle ? `| Find ${assetData?.name} Auctions` : ""
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
export const getCityNamesCommaSeparated = (cities: any[]): string => {
  return cities.map((city) => city.name).join(", ");
};

export const getCategoryNamesCommaSeparated = (categories: any[]): string => {
  return categories.map((category) => category.name).join(", ");
};

export const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, "-");

export const getImageCloudfrontUrl = (
  imageUrl: string,
  sectionRef: INSTRUCTIONS_FOLDER_NAME,
  parentFolderName: string = "instructions"
) => {
  const cloudfrontBase =
    parentFolderName === "instructions"
      ? process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT
      : CONFIG.AUCTION_DEKHO_S3;
  const actualImageUrl = `${cloudfrontBase}/${parentFolderName}/${sectionRef}/${imageUrl}.png`;

  return actualImageUrl;
};

export function stripHtmlTags(html: string): string {
  if (!html) return "";

  // Create a temporary DOM element to safely extract text
  const tempElement =
    typeof window !== "undefined" ? document.createElement("div") : null;

  if (tempElement) {
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  }

  // Fallback (server-side)
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


export const userTypeOptions = [
  { value: USER_TYPE.INDIVIDUAL, label: STRING_DATA.INDIVIDUAL, name: USER_TYPE.INDIVIDUAL },
  { value: USER_TYPE.INVESTOR, label: STRING_DATA.INVESTOR, name: USER_TYPE.INVESTOR },
  { value: USER_TYPE.BROKER, label: STRING_DATA.BROKER, name: USER_TYPE.BROKER },
];

export interface IServiceProviders {
  value: string;
  label: string;
  name: string;
}

export const SERVICE_PROVIDER_OPTIONS: IServiceProviders[] = [
  { value: '', label: 'All', name: 'All' },
  { value: 'baanknet', label: 'BaankNet', name: 'BaankNet' },
  { value: 'ibapi', label: 'IBAPI', name: 'IBAPI' },
  { value: 'bankauctions', label: 'Bank Auctions', name: 'Bank Auctions' },
  { value: 'bankeauctions', label: 'Bank E-Auctions', name: 'Bank E-Auctions' },
  { value: 'drtauctiontiger', label: 'DRT Auction Tiger', name: 'DRT Auction Tiger' },
  { value: 'auctionfocus', label: 'Auction Focus', name: 'AuctionFocus' },
  { value: 'eauctionsindia', label: 'E-auctionindia', name: 'E-auctionindia' }
];

export const formatISTDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString.replace('Z', ''));

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata', // Force IST
    }).replace(',', ''); // optional: remove comma between date & time
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatISTTimeOnly = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString.replace('Z', ''));

    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata', // Force IST
    }).replace(',', ''); // optional: remove comma between date & time
  } catch (error) {
    return 'Invalid date';
  }
};

export const getDateAndTimeFromISOString = (isoString: string): { date: string, timePart: string } => {
  const [year, month, day] = isoString?.split("T")[0]?.split("-");
  const formattedDate = `${day}-${month}-${year}`; // "09-04-2025"
  const timePart = isoString?.split("T")[1]?.replace("Z", ""); // "10:30:00.000"
  if (!timePart) return { date: formattedDate, timePart: 'Not specified' };

  const ampm = parseInt(timePart?.split(":")[0]) >= 12 ? "pm" : "am";
  const h = parseInt(timePart?.split(":")[0]) % 12 || 12;
  const minutes = timePart?.split(":")[1];
  const formattedTime = `${h}:${minutes} ${ampm}`;

  return { date: formattedDate, timePart: formattedTime };
};

export const getDateAndTimeFromISOStringForDisplay = (isoString: string): string => {
  return isoString ? `${getDateAndTimeFromISOString(isoString).date} ${getDateAndTimeFromISOString(isoString).timePart}` : 'Not specified';
}


export const formatDateForDisplay = (dateString: string | null | undefined) => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString.replace('Z', ''));
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      timeZone: 'Asia/Kolkata'
    }).replace(/ /g, '-');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateAndTimeForDisplay = (dateString: string | null | undefined) => {
  if (!dateString) return 'Not specified';
  try {
    const date = new Date(dateString.replace('Z', ''));
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      timeZone: 'Asia/Kolkata'
    }).replace(/ /g, '-');

    const formattedTime = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });

    return `${formattedDate}, ${formattedTime}`;
  } catch (error) {
    return 'Invalid date';
  }
};


export function extractPhoneNumbers(contactString: string): string[] {
  // Remove common prefixes and labels
  const cleanedString = contactString
    .replace(/Contact\s*(Mr\.\/Mrs\.)?\s*(No|Number|Mobile|Tel|Phone)\s*:?\s*/gi, '')
    .trim();

  // Match phone numbers with optional country code and optional separators
  const phonePattern =
    /(?:\+?91[-.\s]?)?(?:\d{5}[-.\s]?\d{5})/g;

  const matches = cleanedString.match(phonePattern) || [];

  // Normalize: remove all non-digit characters
  const normalized = matches.map(num => num.replace(/\D/g, ''));
  // Remove duplicates and return
  return Array.from(new Set(normalized));
}

export const getPopularDataBySortOrder = (data?: any[], limit: number = 5) => {
  // Fallbacks: ensure data is an array, limit is a positive integer
  if (!Array.isArray(data) || data.length === 0) return [];
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 5;

  // Defensive: sortOrder fallback to Infinity so undefined/null go to end
  return data
    .slice() // avoid mutating original
    .sort((a, b) => {
      const aOrder = typeof a?.sortOrder === "number" ? a.sortOrder : Infinity;
      const bOrder = typeof b?.sortOrder === "number" ? b.sortOrder : Infinity;
      return aOrder - bOrder;
    })
    .slice(0, safeLimit);
};

export const getBankBySlug = (banks: IBanks[] | null, slug: string): IBanks | undefined => {
  return banks?.find((bank) => bank.slug === slug || bank.secondarySlug === slug);
};

export const getLocationBySlug = (locations: ILocations[] | null, slug: string): ILocations | undefined => {
  return locations?.find((location) => location.slug === slug);
};

export const getCategoryBySlug = (categories: ICategoryCollection[] | null, slug: string): ICategoryCollection | undefined => {
  return categories?.find((category) => category.slug === slug);
};

export const getAssetTypeBySlug = (assetTypes: IAssetType[] | null, slug: string): IAssetType | undefined => {
  return assetTypes?.find((assetType) => assetType.slug === slug);
};