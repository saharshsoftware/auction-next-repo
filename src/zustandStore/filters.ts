import { FILTER_EMPTY } from "@/shared/Constants";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const FILTER_KEY = "auction-filter"; // Key for storing filter data in localStorage

export interface IFilters {
  // name: "",
  bank: any;
  location: any;
  category: any;
  price: any[];
  propertyType: any;
}

type State = {
  filter: IFilters;
};

type Action = {
  setFilter: (payload: typeof FILTER_EMPTY) => void;
  clearFilter: () => void;
};

export interface IFilterStore extends State, Action {}

export const useFilterStore = create<IFilterStore>()(
  devtools((set) => ({
    filter: FILTER_EMPTY,
    // Set filter data and store it in localStorage
    setFilter: (payload: IFilters) => {
      localStorage.setItem(FILTER_KEY, JSON.stringify(payload));
      set({ filter: payload });
    },

    // Clear filter data and reset to FILTER_EMPTY
    clearFilter: () => {
      localStorage.removeItem(FILTER_KEY);
      set({ filter: FILTER_EMPTY });
    },
  }))
);

// Load token and filter data from localStorage (e.g., during app startup)
if (typeof window !== "undefined") {
  (async () => {
    const filterData = localStorage.getItem(FILTER_KEY);
    const parsedFilterData = filterData ? JSON.parse(filterData) : FILTER_EMPTY;
    if (filterData) {
      useFilterStore.setState({
        filter: parsedFilterData,
      });
    }
  })();
}
