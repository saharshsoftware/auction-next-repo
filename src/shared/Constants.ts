import { ROUTE_CONSTANTS } from "./Routes"

export const STRING_DATA = {
  EMPTY: "",
  LOGIN: "Log in",
  DASHBOARD: "Dashboard",
  BRAND_NAME: "Auction",
  REGISTER: "Sign up",
  CREATE_ACCOUNT: "Create Acount",
  SEARCH: "Search",
  TAG_LINE: "Find Auctions Near You",
  POPULER_CITIES: "Popular Cities",
  AUCTION: "Auction",
  UPDATE: "Update",
  CANCEL: "Cancel",
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
  TOP_CITY: "Top City"
}

export const INPUT_TYPE = {
  TEXT:"text",
  TEXT_AREA: "textarea",
  RANGE: "range",
  PASSWORD: "password",
  NUMBER: "number"
}

export const RANGE_PRICE = {
  MIN: "0",
  MAX: "100000"
}

export const ERROR_MESSAGE = {
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  CATEGORY_REQUIRED: "Category is required",
  LOCATION_REQUIRED: "Location is required",  
  BANK_REQUIRED: "Bank is required",  
  PRICE_REQUIRED: "Price is required",
  PRICE_POSITIVE: "Price must be a positive number",
  PRICE_INTEGER: "Price must be an integer"
}

export const NAV_LINKS = [
  {
    id: 1,
    label: STRING_DATA.PROFILE,
    path: ROUTE_CONSTANTS.PROFILE
  },
  {
    id: 2,
    label: STRING_DATA.SETTINGS,
    path: ROUTE_CONSTANTS.SETTINGS
  },
  {
    id: 3,
    label: STRING_DATA.LOGIN,
    path: ROUTE_CONSTANTS.LOGIN
  },
  {
    id: 4,
    label: STRING_DATA.REGISTER,
    path: ROUTE_CONSTANTS.REGISTER
  },
] 

export const CATEGORIES = [
  {
    name:"All",
    id: 0
  },
  {
    name:"Flat and Floor",
    id: 1
  },
  {
    name:"House and Residential Plot",
    id: 2
  },
  {
    name: "Land, Plot and Site",
    id: 3
  },
  {
    name:"Commercial, Office and Shop",
    id: 4
  },
  {
    name:"Car",
    id: 5
  },
  {
    name: "Plant and Machinery, Plot and Site", 
    id: 6
  },
] 

export const POPULER_CITIES = [
  {
    id: 1,
    label:"Jaipur",
    value: "Jaiput"
  },
  {
    id: 2,
    label:"Mumbai",
    value: "Mumbai"
  },
  {
    id: 3,
    label:"Delhi",
    value: "Delhi"
  },
  {
    id: 4,
    label:"Bangalore",
    value: "Bangalore"
  },
  {
    id: 5,
    label:"Chennai",
    value: "Chennai"
  }
] 


export const SAMPLE_PLOT = [
  {
    id: 1,
    title: "Luxury Apartment in Manhattan",
    desc: "Luxurious apartment with stunning views Luxurious apartment with stunning viewsLuxurious apartment with stunning viewsLuxurious apartment with stunning viewsLuxurious apartment with stunning viewsLuxurious apartment with stunning viewsLuxurious apartment with stunning viewsLuxurious apartment with stunning viewsLuxurious ",
    price: "1465546",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z",
    view_auction_data: {
      bank_name: "IDFC FIRST Bank ",
      property: "Typeplot",
      area:"66.97 Sq Mtrs",
      possession: "physical",
      locality: "Kunvarda, Surat",
      city:"Surat",
      reserve_price: "1051200",
      emd_amount:"105120",
      emd_submission: "2024-02-28T12:07:32.466Z",
      auction_start_date_and_time: "2024-02-28T12:07:32.466Z",
      auction_end_date_and_time: "2024-02-28T12:07:32.466Z"
    }
  },
  {
    id: 2,
    title: "Cozy Cottage in the Countryside",
    desc: "Quaint cottage surrounded by nature",
    price: "14254623",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 3,
    title: "Modern Condo in Downtown",
    desc: "Chic condo in the heart of the city",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 4,
    title: "Beachfront Villa in Bali",
    desc: "Exquisite villa with private beach access",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 5,
    title: "Mountain Retreat in the Alps",
    desc: "Secluded retreat nestled in the mountains",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 6,
    title: "Historic Townhouse in London",
    desc: "Elegant townhouse with period features",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 7,
    title: "Riverside Cabin in the Woods",
    desc: "Rustic cabin overlooking a tranquil river",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 8,
    title: "Sky-High Penthouse in Dubai",
    desc: "Luxurious penthouse with panoramic city views",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 9,
    title: "Farmhouse with Vineyard in Tuscany",
    desc: "Idyllic farmhouse surrounded by vineyards",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  },
  {
    id: 10,
    title: "Lakefront Retreat in Canada",
    desc: "Serenity awaits at this lakefront retreat",
    price: "234234234",
    bank_name: "IDFC FIRST Bank ",
    date: "2024-02-28T12:07:32.466Z"
  }
];

export const REACT_QUERY = {
  COUNTRIES: "Countries"
}

export const SAMPLE_CITY = [
  { id: 1, label: 'Delhi', value: 'Delhi' },
  { id: 2, label: 'Bangalore', value: 'Bangalore' },
  { id: 3, label: 'Hyderabad', value: 'Hyderabad' },
  { id: 4, label: 'Chennai', value: 'Chennai' },
  { id: 5, label: 'Kolkata', value: 'Kolkata' },
  { id: 6, label: 'Pune', value: 'Pune' },
  { id: 7, label: 'Ahmedabad', value: 'Ahmedabad' },
  { id: 8, label: 'Jaipur', value: 'Jaipur' },
  { id: 9, label: 'Lucknow', value: 'Lucknow' },
  { id: 10, label: 'Mumbai', value: 'Mumbai' },  
];

