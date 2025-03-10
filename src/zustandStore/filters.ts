import { FILTER_EMPTY } from "@/shared/Constants";
import { IBanks } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const FILTER_KEY = "auction-filter"; // Key for storing filter data in localStorage

export interface IFilters {
  bank: any;
  location: any;
  category: any;
  price: any[];
  propertyType: any;
}

type State = {
  filter: IFilters;
  prevParams: IFilters | null; // Add prevParams to store
};

type Action = {
  setFilter: (payload: IFilters) => void;
  setPrevParams: (payload: IFilters) => void; // Action to update prevParams
  clearFilter: () => void;
  setBank: (bank: any) => void;
  setLocation: (location: any) => void;
  setCategory: (category: any) => void;
  setPropertyType: (propertyType: any) => void;
};

export interface IFilterStore extends State, Action {}

export const useFilterStore = create<IFilterStore>()(
  devtools((set) => ({
    filter: FILTER_EMPTY,
    prevParams: null, // Initialize prevParams as null

    // Set filter data and store it in localStorage
    setFilter: (payload: IFilters) => {
      set({ filter: payload });
    },

    // Set previous params
    setPrevParams: (payload: IFilters) => {
      set({ prevParams: payload });
    },

    // Clear filter data and reset to FILTER_EMPTY
    clearFilter: () => {
      set({ filter: FILTER_EMPTY, prevParams: null }); // Reset prevParams as well
    },

    // Individual field update methods
    setBank: (bank: IBanks) => {
      set((state) => {
        const updatedFilter = { ...state.filter, bank };
        return { filter: updatedFilter };
      });
    },

    setLocation: (location) => {
      set((state) => {
        const updatedFilter = { ...state.filter, location };
        return { filter: updatedFilter };
      });
    },

    setCategory: (category) => {
      set((state) => {
        const updatedFilter = { ...state.filter, category };
        return { filter: updatedFilter };
      });
    },

    setPropertyType: (propertyType) => {
      set((state) => {
        const updatedFilter = { ...state.filter, propertyType };
        return { filter: updatedFilter };
      });
    },
  }))
);
