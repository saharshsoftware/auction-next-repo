import { IAuction } from "@/types";
import { create } from "zustand";

interface IPaginationData {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

interface AuctionState {
  auctionList: IAuction[];
  page: number;
  isLoading: boolean;
  paginationData: IPaginationData;
  setAuctions: (auctions: IAuction[]) => void;
  setPage: (newPage: number) => void;
  resetAuctions: () => void;
  setPaginationData: (data: IPaginationData) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  auctionList: [],
  page: 1,
  isLoading: true,
  paginationData: {
    page: 1,
    pageCount: 0,
    pageSize: 10,
    total: 0,
  },
  setAuctions: (auctions) =>
    set((state) => ({
      auctionList: auctions,
    })),

  setPage: (newPage) => set({ page: newPage }),

  resetAuctions: () => set({ auctionList: [], page: 1 }),
  setPaginationData: (data: IPaginationData) => set({ paginationData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
