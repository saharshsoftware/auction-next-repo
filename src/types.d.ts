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
  auctionDate: Date;
  auctionStartTime: Date;
  auctionEndDate: Date;
  applicationSubmissionDate: Date;
  reservePrice: number;
  emd: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  title: string;
  contactNo: string;
  auctionId: string;
  description: string;
}

export interface IUserData {
  jwt: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  name: null;
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
  auctionDate: Date;
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

export interface IUserSurvey {
  id: string;
  answers: any[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  status: "COMPLETED" | "REMIND_LATER" | null;
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
