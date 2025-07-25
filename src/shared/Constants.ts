import {
  faBell,
  faFilter,
  faHeart,
  faList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ROUTE_CONSTANTS } from "./Routes";

export const COOKIES = {
  TOKEN_KEY: "auction-token",
  AUCTION_USER_KEY: "auction-user-data",
  AUCTION_FILTER: "auction-filter",
};

export const RANGE_PRICE = {
  MIN: "0",
  MAX: "100000000",
  STEPS: "100000",
};

export const FILTER_EMPTY = {
  // name: "",
  bank: "",
  location: "",
  category: "",
  price: [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  propertyType: "",
};

export const NAVICON_COLOR = "#a6a6a6";

export const PAGE_REVALIDATE_TIME_FOR_AUCTION_DETAIL = 86400; // 24 hr
export const PAGE_REVALIDATE_TIME_FOR_AUCTION_LIST = 3600; // 1 hr
export const FILTER_API_REVALIDATE_TIME = 300; // 5 min

export const STRING_DATA = {
  INDIVIDUAL: "Individual",
  BROKER: "Broker",
  HELPS_US_PERSONALIZE_RECOMMENDATIONS_FOR_YOU: "Helps us personalize recommendations for you",
  ALREADY_INTERESTED: "Interested",
  BLOGS: "Blogs",
  SAVE: "Save",
  LOGIN_VIEW_DOC: "Login to view",
  HOME: "Home",
  SHOW_INTEREST: "Show interest",
  DELETE_ACCOUNT: "Delete account",
  EDIT_ALERT: "Edit alert",
  UPDATE_PASSWORD: "Update password",
  EDIT_PROFILE: "Edit Profile",
  YOUR_ALERTS: "Your alerts",
  TOP_ASSETS: "Top assets",
  ASSETS: "Assets",
  SAVED: "Saved",
  SAVED_SEARCH: "Saved Search",
  SUBMIT: "Submit",
  CONTACT_FORM: "Contact form",
  EDIT_LIST: "Edit list",
  BORROW_NAME: "Borrow name",
  CONTACT: "Contact",
  CITIES: "Cities",
  BANKS: "Banks",
  CATEGORIES: "Categories",
  CATEGORIES_LOWER: "categories",
  TERMS_CONDITIONS: "Terms and condition",
  PRIVACY_POLICY: "Privacy policy",
  CONTACT_US: "Contact us",
  ABOUT_US: "About us",
  SITEMAP: "Sitemap",
  DELETE: "Delete",
  TOP_CATEGORIES: "Top categories",
  CATEGORY: "Category",
  TOP_BANKS: "Top banks",
  OTHER_CATEGORIES: "Other categories",
  OTHER_LOCATIONS: "Other location",
  OTHER_BANKS: "Other banks",
  REMOVE: "Remove",
  MESSAGE_PROCEED: "Are you sure you want to proceed?",
  CONFIRMATION: "Confirmation",
  ADD: "Add",
  ADD_LIST: "Add list",
  CREATE_ALERT: "Create Alert",
  YOUR_LIST: "Your list",
  ALL: "All",
  BACK: "Back",
  EAUCTION_DEKHO: "eauctiondekho",
  EMPTY: "",
  LOGOUT: "Logout",
  ALREADY_HAVE_ACCOUNT: "Already have an account?",
  NOT_REGISTERED: "Not registered?",
  NOTICE: "Notice",
  LOGIN: "Login",
  LOGIN_OTP: "Login with OTP",
  DASHBOARD: "Dashboard",
  BRAND_NAME: "Auction",
  REGISTER: "Signup",
  CREATE_ACCOUNT: "Create Account",
  SEARCH: "Search",
  TAG_LINE: "Find Auctions Near You",
  POPULER_CITIES: "Popular Cities",
  AUCTION: "Auction",
  UPDATE: "Update",
  CANCEL: "Cancel",
  OPTIONAL_FIELDS: "Optional Fields",
  INVESTOR: "Investor",
  REGULAR: "Regular",
  USER_TYPE: "User Type",
  YES: "Yes",
  NO: "No",
  INTERESTED_CATEGORIES: "Interested Categories (Upto 5 categories)",
  AUCTION_DETAIL: "Auction Detail",
  ID_SLASH: "/:id",
  PROFILE: "Profile",
  SETTINGS: "Settings",
  DESCRIPTION: "Description",
  BANK: "Bank",
  PROPERTY_TYPE: "Property Type",
  AREA: "Area",
  POSSESSION: "Possession",
  LOCALITY: "Locality",
  CITY: "City",
  RESERVED_PRICE: "Reserved Price",
  EMD_AMOUNT: "EMD Amount",
  EMD_SUBMISSION: "EMD submission",
  AUCTION_START_D_AND_T: "Auction Start Date & Time",
  AUCTION_END_D_AND_T: "Auction End Date & Time",
  SIMILER_PROPERTIES: "Similer Properties",
  TOP_CITY: "Top City",
  TOP_CITIES: "Top Cities",
  SERVICE_PROVIDER: "Service provider",
  BRANCH_NAME: "Branch name",
  MANAGE_LIST: "Manage list",
  MANAGE_ALERT: "Manage alert",
  ADD_TO_LIST: "Add to list",
  NO_DATA_FOUND_LIST_PROPERTY:
    "No property added to the list. Please go to the property detail and add the property in your desired list",
  NO_DATA_FOUND_LIST:
    "You can organize your favorite properties by categorizing it into various lists",
  MANAGE_FILTERS: "Manage filter",
  YOUR_FILTERS: "Your filters",
  NO_SAVED_LIST_FOUND: "No saved search found",
  NO_ALERT_FOUND: "No alert found",
  DELETE_SEARCH_ITEM_MESSAGE:
    "Are you sure you want to delete this saved search ?",
  DELETE_ALERT_MESSAGE: "Are you sure you want to delete this alert ?",
  YOUR_WISHLIST: "Your wishlist",
  YOUR_SAVED_SEARCH: "Your saved search",
  LOCATIONS: "locations",
  ASSETS_TYPE: "asset-types",
  TYPES: "types",
  BACK_TO_LOGIN: "Back to Login",
};

export const NAVBAR_NAV_LINKS = [
  {
    path: ROUTE_CONSTANTS.PROFILE,
    label: STRING_DATA.PROFILE,
    icon: faUser,
  },
  {
    path: ROUTE_CONSTANTS.MANAGE_LIST,
    label: STRING_DATA.YOUR_WISHLIST,
    icon: faHeart,
  },
  {
    path: ROUTE_CONSTANTS.MANAGE_ALERT,
    label: STRING_DATA.YOUR_ALERTS,
    icon: faBell,
  },
  {
    path: ROUTE_CONSTANTS.MANAGE_FILTERS,
    label: STRING_DATA.YOUR_SAVED_SEARCH,
    icon: faFilter,
  },
];

export const INPUT_TYPE = {
  TEXT: "text",
  TEXT_AREA: "textarea",
  RANGE: "range",
  PASSWORD: "password",
  NUMBER: "number",
};

export const ERROR_MESSAGE = {
  CURRENT_PASSWORD: "Current password is required",
  NEW_PASSWORD_REQUIRED: "New password is required",
  ASSET_TYPE_REQ: "Asset type is required",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  CATEGORY_REQUIRED: "Category is required",
  SUBJECT_REQUIRED: "Subject is required",
  MESSAGE_REQUIRED: "Message is required",
  LOCATION_REQUIRED: "Location is required",
  BANK_REQUIRED: "Bank is required",
  PRICE_REQUIRED: "Price is required",
  PRICE_POSITIVE: "Price must be a positive number",
  PRICE_INTEGER: "Price must be an integer",
  USERNAME: "Username is required",
  CONFIRM_PASSWORD: "Confirm password is required",
  MIN_2: "Please enter a name with at least 2 characters",
  MIN_6: "Your password must be at least 6 characters",
  MAX_PASS_30: "Password length should not exceed 30 characters",
  MAX_USERNAME_30: "Username should not exceed 30 characters",
  NAME_REQUIRED: "Name is required",
  MAX_NAME_30: "Name should not exceed 30 characters",
  PASSWORDS_MUST_MATCH: "Passwords must match",
  LIST_REQUIRED: "List is required",
  PHONE_REQUIRED: "Phone number is required",
  PHONE_NUMERIC: "Please enter numeric value",
  PHONE_LENGTH: "Please enter",
  MIN_PHONE_LENGTH: "Invalid number",
  EMAIL_INVALID: "Invalid email address",
  MOBILE_REQUIRED: "Mobile number is required",
  MAX_PHONE_LENGTH: "Phone number should not exceed 10 digits",
  VALID_EMAIL: "Please enter a valid email address",
  INTERESTED_CITIES_REQUIRED: "Interested cities are required",
};

export const NAV_LINKS = [
  {
    id: 1,
    label: STRING_DATA.PROFILE,
    path: ROUTE_CONSTANTS.PROFILE,
  },
  {
    id: 2,
    label: STRING_DATA.SETTINGS,
    path: ROUTE_CONSTANTS.SETTINGS,
  },
  {
    id: 3,
    label: STRING_DATA.LOGIN,
    path: ROUTE_CONSTANTS.LOGIN,
  },
  {
    id: 4,
    label: STRING_DATA.REGISTER,
    path: ROUTE_CONSTANTS.REGISTER,
  },
];

export const CATEGORIES = [
  {
    name: "All",
    id: 0,
  },
  {
    name: "Flat",
    id: 1,
  },
  {
    name: "Floor",
    id: 2,
  },
  {
    name: "House",
    id: 3,
  },
  {
    name: "Residential",
    id: 4,
  },
  {
    name: "Land",
    id: 5,
  },
  {
    name: "Plot",
    id: 6,
  },
  {
    name: "Site",
    id: 7,
  },
  {
    name: "Commercial",
    id: 8,
  },
  {
    name: "Office",
    id: 9,
  },
  {
    name: "Shop",
    id: 10,
  },
  {
    name: "Car",
    id: 11,
  },
  {
    name: "Plant",
    id: 12,
  },
  {
    name: "Machinery",
    id: 13,
  },
];

export const POPULER_CITIES = [
  {
    id: 1,
    label: "Jaipur",
    value: "Jaiput",
  },
  {
    id: 2,
    label: "Mumbai",
    value: "Mumbai",
  },
  {
    id: 3,
    label: "Delhi",
    value: "Delhi",
  },
  {
    id: 4,
    label: "Bangalore",
    value: "Bangalore",
  },
  {
    id: 5,
    label: "Chennai",
    value: "Chennai",
  },
];

export const REACT_QUERY = {
  COUNTRIES: "Countries",
  HOME_BOX_COLLETIONS: "Home-box-collections",
  CATEGORY_BOX_COLLECITON: "Categroy-box-collection",
  CATEGORY_BOX_COLLECITON_OPTIONS: "Categroy-box-collection-options",
  AUCTION_BANKS: "Auction-bank",
  AUCTION_LOCATION: "Auction-location",
  FAVOURITE_LIST: "Favourite-list",
  FAVOURITE_LIST_PROPERTY: "Favourite-list-property",
  FIND_AUCTION: "Find-auction",
  AUCTION_DETAIL: "auction-detail",
  ASSETS_TYPE: "Assets-type",
  AUCTION_LOCATION_ALL: "Auction-location-all",
  SAVED_SEARCH: "Saved-search",
  ALERTS: "Alerts",
  CATEGORY_ASSETS_TYPE: "Category-Assets-type",
  SURVEYS: "Surveys",
  USERS_SURVEYS: "Users-surveys",
  USER_PROFILE: "User-profile",
};

export const SAMPLE_CITY = [
  { id: 1, label: "Delhi", value: "Delhi" },
  { id: 2, label: "Bangalore", value: "Bangalore" },
  { id: 3, label: "Hyderabad", value: "Hyderabad" },
  { id: 4, label: "Chennai", value: "Chennai" },
  { id: 5, label: "Kolkata", value: "Kolkata" },
  { id: 6, label: "Pune", value: "Pune" },
  { id: 7, label: "Ahmedabad", value: "Ahmedabad" },
  { id: 8, label: "Jaipur", value: "Jaipur" },
  { id: 9, label: "Lucknow", value: "Lucknow" },
  { id: 10, label: "Mumbai", value: "Mumbai" },
];

export const getEmptyAllObject = () => ({
  value: "",
  label: STRING_DATA.ALL,
});

export const STORAGE_KEYS = {
  AUCTION_VIEW_KEY: "auctionViews",
  SURVEY_SHOWN_KEY: "surveyShown",
  SURVEY_DISMISS_KEY: "dismissedSurvey",
  DEVICE_ID: "deviceId",
  PAGE_VIEWS: "user_page_views",
  SEARCH_COUNT: "user_search_count",
  SESSION_TIME: "page_session_time",
  SURVEY_SHOWN: "SurveyId_",
  LAST_SURVEY_ID: "last_survey_id",
  LAST_PAGE_VIEWS_UPDATE: "last_page_views_update",
  SURVEY_TRIGGER_TIME: "survey_trigger_time",
  SHOW_LOGIN_FLAG: "showLoginFlag",
  AUCTION_VISIT_IDS: "auctionVisitIds",
};

export const SESSIONS_STORAGE_KEYS = {
  CURRENT_PATH: "currentPath",
  PREVIOUS_PATH: "previousPath",
};

export const YEAR_OF_EXPERIENCE = [
  { id: 1, label: "0-1 Year", value: "0-1 Year" },
  { id: 2, label: "1-2 Years", value: "1-2 Years" },
  { id: 3, label: "2-3 Years", value: "2-3 Years" },
  { id: 4, label: "3-4 Years", value: "3-4 Years" },
  { id: 5, label: "4-5 Years", value: "4-5 Years" },
  { id: 6, label: "5 + Years", value: "5 + Years" },
];

export const IMAGES_NAME = {
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
  TEN: "10",
};
