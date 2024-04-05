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
  id?: string;
  bankName?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ILocations {
  id?: string;
  name?: string;
  type?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ICategoryCollection {
  id: string;
  categoryName?: string;
  collectionIcon?: string;
  totalAuctions?: number;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  slug?: string;
}