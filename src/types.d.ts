// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

declare module "react-slick";
declare module "react-range-slider-input";
declare module "markdown-it";
declare module "lodash/debounce";

export interface IAssetType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: null;
  totalNotices: number;
  imageURL: string;
  isPopular: boolean;
  slug: "plot";
  category: any;
  label?: string;
  pluralizeName?: string;
  sortOrder?: number;
}

export interface IAuction {
  [x: string]: any;
  id: string;
  propertyType: string;
  location: string;
  bankName: string;
  branchName: string;
  serviceProvider: string;
  borrowerName: string;
  assetCategory: string;
  auctionType: string;
  noticeLink: string;
  authorisedOfficerContactPerson: string;
  auctionStartTime: string;
  auctionStartTime: string;
  auctionEndDate: string;
  applicationSubmissionDate: string;
  reservePrice: number;
  emd: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  auctionId: string;
  description: string;
  slug: string;
  title: string;
  auctionId?: string;
  description?: string;
  state?: string;
  city?: string;
  area?: string;
  noticeLink?: string;
  noticeImageURLs?: string[];
  noticeImageUrl?: string;
  estimatedMarketPrice?: number;
  assetType?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  createdById?: string;
  auctionStartTime?: string;
  auctionStartTime?: string;
  auctionEndDate?: string;
  applicationSubmissionDate?: string;
  reservePrice?: number;
  emd?: number;
  title?: string;
  contact?: string
}

export interface IUserData {
  jwt: string;
  user: User;
}

export enum USER_TYPE {
  INDIVIDUAL = "INDIVIDUAL",
  INVESTOR = "INVESTOR",
  BROKER = "BROKER",
}

export interface BudgetRange {
  min: string;
  max: string;
  label: string;
}

export type BudgetRangeObject = Pick<BudgetRange, "min" | "max">;

export interface User {
  id: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  name: null;
  interestedCities?: string;
  interestedCategories?: string;
  userType?: USER_TYPE;
  budgetRanges: BudgetRangeObject[];
}

export interface IBanks {
  id?: string | number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  route?: string;
  slug?: string;
  imageURL?: string;
  secondarySlug?: string;
  sortOrder?: number;
}

export interface ILocations {
  id?: string | number;
  name?: string;
  type?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  route?: string;
  slug?: string;
  imageURL?: string;
  sortOrder?: number;
}

export interface ICategoryCollection {
  [x: string]: ReactNode;
  id: string | number;
  name?: string;
  collectionIcon?: string;
  totalAuctions?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  slug?: string;
  categoryName?: string;
  route?: string;
  sortOrder?: number;
}

export interface IHomeBoxCollection {
  id: number;
  name: string;
  strapiAPIQuery: string;
  componentName: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  active: boolean;
}

export interface IFavouriteList {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFavouriteListProperty {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  property: IProperty;
}

export interface IProperty {
  id: string;
  propertyType: string;
  location: string;
  bankName: string;
  branchName: string;
  serviceProvider: string;
  borrowerName: string;
  assetCategory: string;
  auctionType: string;
  noticeLink: string;
  authorisedOfficerContactPerson: null;
  auctionStartTime: Date;
  auctionStartTime: Date;
  auctionEndDate: Date;
  applicationSubmissionDate: Date;
  reservePrice: number;
  emd: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  title: string;
  contactNo: null;
  auctionId: null;
  description: string;
  state: null;
  city: null;
  area: null;
  contact: null;
  noticeImageURL: null;
}

export interface ISpecificRoute {
  isCategoryRoute?: boolean;
  isLocationRoute?: boolean;
  isBankRoute?: boolean;
}

export interface ISavedSearch {
  id?: string | number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  route?: string;
  slug?: string;
  filter: string;
  sitemap_exclude: boolean;
}

export interface IAlert {
  id: string;
  assetCategory: string;
  assetType: string;
  bankName: string;
  createdAt: string;
  location: string;
  maxPrice: string;
  minPrice: string;
  name: string;
  updatedAt: string;
  budgetRanges?: BudgetRangeObject[];
}

export interface ISurvey {
  title: string;
  id: string;
  questions: { [key: string]: Question };
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  isActive: boolean;
}

export type USER_SURVEY_STATUS =
  | "COMPLETED"
  | "REMIND_LATER"
  | "INCOMPLETE"
  | "null";

export interface IUserSurvey {
  id: string;
  answers: any[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  status: USER_SURVEY_STATUS;
}

export interface Question {
  id: string;
  type: Type;
  options: ISurveyOptions[];
  question: string;
  condition?: Condition;
  allowCustomInput?: boolean;
}

export interface ISurveyOptions {
  label: string;
  next: string;
  prev: string;
}
export interface Condition {
  answer: string;
  questionId: string;
}

export enum Type {
  MultipleChoice = "multiple-choice",
  SingleChoice = "single-choice",
}

export interface BlogPost {
  title: string;
  id: string;
  slug: string;
  description: string;
  image: string;
  slug: string;
  publishedAt: Date;
  blog_categories: { data: ICategoryCollection[] };
  reading_time: string;
  no_of_likes: number;
}
export interface FilterItem {
  [x: string]: any;
  id: string;
  name: string;
  slug: string;
  state?: string;
  type?: string;
}

export type FilterType = "category" | "bank" | "assetType" | "location";

export interface TempFilters {
  category: FilterItem | null;
  bank: FilterItem | null;
  propertyType: FilterItem | null;
  location: FilterItem | null;
  price: number[];
}

export type INSTRUCTIONS_FOLDER_NAME =
  | "alerts-instructions"
  | "saved-search-instructions"
  | "wishlist-instructions";

export interface SortOption {
  label: string;
  value: string;
}

// Lead Recommendations
export interface LeadInfo {
  id: number;
  contactName: string;
  contactEmail: string;
  interestedCities: string[];
  propertyCategories: string[];
}

export interface LeadNoticeRecommendation {
  id: number;
  bankName: string;
  branchName: string;
  assetCategory: string;
  title: string;
  noticeLink: string;
  city: string;
  state: string;
  reservePrice: number;
  emd: number;
  slug?: string;
  contact?: string;
  noticeImageURL?: string | null;
  serviceProvider?: string | null;
  assetType?: string | null;
  propertyAddress?: string | null;
  auctionStartTime?: string;
  auctionEndDate?: string;
}

export interface LeadRecommendationItem {
  id: number;
  createdAt: string;
  lead: LeadInfo;
  notice: LeadNoticeRecommendation;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface LeadRecommendationsResponse {
  data: LeadNoticeRecommendation[];
  meta?: {
    pagination: PaginationMeta;
    sort?: { field: string; order: "asc" | "desc" };
  };
}