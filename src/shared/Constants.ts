import {
  faBell,
  faFilter,
  faHeart,
  faList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ROUTE_CONSTANTS } from "./Routes";
import { CONFIG } from "@/utilies/Config";
import { FAQItem } from "@/components/templates/FaqPage";

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

// App Store URLs for Survey Card
export const APP_STORE_URLS = {
  GOOGLE_PLAY: CONFIG.PLAYSTORE_URL,
  APP_STORE: CONFIG.APPSTORE_URL,
  GOOGLE_REVIEW: CONFIG.GOOGLE_REVIEW_URL,
} as const;

export const faqData: FAQItem[] = [
  {
    question: "How do I participate in a property auction?",
    answer: "To participate in a property auction, you need to: 1) Register on the auction platform, 2) Pay the Earnest Money Deposit (EMD), 3) Submit required documents, 4) Attend the property inspection (if needed), and 5) Place your bids during the live auction.",
    tags: "Getting Started"
  },
  {
    question: "What is Earnest Money Deposit (EMD) and is it refundable?",
    answer: "EMD is a security deposit (typically 5-10% of reserve price) that shows your serious intent to purchase. It's fully refundable if you don't win the auction or if the auction is cancelled. However, if you win and fail to complete the purchase, the EMD may be forfeited.",
    tags: "Payments"
  },
  {
    question: "What happens if I win the auction?",
    answer: "If you're the highest bidder: 1) You'll receive a confirmation, 2) Pay the remaining amount (usually within 15-30 days), 3) Complete legal formalities, 4) Receive the sale certificate, and 5) Get possession of the property as per the terms.",
    tags: "Winning Process"
  },
  {
    question: "Can I inspect the property before bidding?",
    answer: "Yes, banks typically schedule property inspection dates before the auction. You can visit the property during these specified times to assess its condition. Some properties may have restricted access if they're occupied.",
    tags: "Property Inspection"
  },
  {
    question: "What documents do I need to participate?",
    answer: "Required documents typically include: Valid ID proof (Aadhaar/PAN), Address proof, Bank statements, Income proof, EMD payment receipt, and a signed undertaking. Specific requirements may vary by bank and property value.",
    tags: "Documentation"
  },
  {
    question: "Are there any hidden costs in property auctions?",
    answer: "Apart from the bid amount, you may need to pay: Registration charges, stamp duty, legal fees, property transfer costs, and any pending dues like property tax or maintenance charges. Always factor these into your budget.",
    tags: "Costs"
  },
  {
    question: "What if the property has legal issues or encumbrances?",
    answer: "Banks are required to disclose known legal issues in the auction notice. However, you should conduct your own due diligence. Properties are typically sold 'as is where is' basis, so any legal complications become the buyer's responsibility.",
    tags: "Legal Issues"
  },
  {
    question: "Can I get a loan to buy an auction property?",
    answer: "Yes, you can apply for a home loan to purchase auction properties. However, loan approval depends on the property's legal status, your eligibility, and the lender's policies. It's advisable to get pre-approval before bidding.",
    tags: "Financing"
  },
  {
    question: "What is the difference between reserve price and market value?",
    answer: "Reserve price is the minimum amount set by the bank below which they won't sell. Market value is the estimated current worth based on location and condition. Reserve price is often lower than market value, creating potential bargains.",
    tags: "Pricing"
  },
  {
    question: "How long does the entire process take?",
    answer: "From auction announcement to possession, the process typically takes 2-4 months. This includes: Auction notice period (30 days), auction day, payment period (15-30 days), and legal formalities (30-60 days).",
    tags: "Timeline"
  },
  {
    question: "Can I cancel my bid after placing it?",
    answer: "No, bids are binding and cannot be cancelled once placed during the live auction. Make sure you're certain about your bid amount and have arranged financing before participating.",
    tags: "Bidding Rules"
  },
  {
    question: "What happens if no one bids above the reserve price?",
    answer: "If no valid bids are received above the reserve price, the auction is considered unsuccessful. The bank may re-auction the property at a later date, possibly with a revised reserve price.",
    tags: "Auction Outcomes"
  },
  {
    question: "Are auction properties always cheaper than market rates?",
    answer: "Not always. While many auction properties sell below market value, competitive bidding can drive prices up. Popular locations and well-maintained properties may sell at or near market rates.",
    tags: "Pricing"
  },
  {
    question: "Can I bid online or do I need to be physically present?",
    answer: "Most modern auctions are conducted online through platforms like BankNet, IBAPI, or Bank E-Auctions. You can participate from anywhere with internet access. Physical presence is rarely required.",
    tags: "Auction Process"
  },
  {
    question: "What if I face technical issues during online bidding?",
    answer: "Contact the auction platform's technical support immediately. Most platforms have dedicated helplines during auction hours. It's advisable to test your internet connection and have backup options ready.",
    tags: "Technical Support"
  }
];