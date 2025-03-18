export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENPOINTS = {
  NOTICES: "/api/notices",
  SIGNUP: "/api/auth/local/register",
  CHANGE_PASSWORD: "/api/auth/change-password",
  LOGIN: "/api/auth/local",
  // BANKS: "/api/banks",
  // LOCATIONS: "/api/locations",
  // CATEGORY_BOX_COLLETIONS: "/api/categories",
  // ASSET_TYPES: "/api/asset-types",
  BANKS: "/api/all-banks",
  LOCATIONS: "/api/all-locations",
  POPULAR_LOCATIONS: "/api/popular-locations",
  POPULAR_BANKS: "/api/popular-banks",
  POPULER_ASSET_TYPES: "/api/popular-asset-types",
  POPULAR_CATEGORIES: "/api/popular-categories",
  CATEGORY_BOX_COLLETIONS: "/api/all-categories",
  ASSET_TYPES: "/api/all-asset-types",
  HOME_BOX_COLLECTIONS: "/api/home-box-collections",
  FAVOURITE_LIST: "/api/favorite-list",
  FAVOURITE_LIST_PROPERTY: "/api/property-in-favorite-list",
  PRIVACY_POLICY: "/api/privacy-policy",
  TERMS: "/api/term",
  ABOUT_US: "/api/about-company",
  CONTACT_US: "/api/contact-us",
  CONTACT_USER: "/api/contact-users",
  SAVED_SEARCH: "/api/saved-search",
  ALERTS: "/api/custom-alert",
  INTEREST: "/api/user-interest/create",
  NOTICE_SEARCH: "/api/notices/search",
  USER_SURVEYS: "/api/user-surveys",
  SURVEYS: "/api/surveys",
};
