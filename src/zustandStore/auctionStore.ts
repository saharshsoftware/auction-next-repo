import { IAuction } from "@/types";
import { create } from "zustand";

interface AuctionState {
  auctionList: IAuction[];
  page: number;
  setAuctions: (auctions: IAuction[]) => void;
  setPage: (newPage: number) => void;
  resetAuctions: () => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  auctionList: [],
  page: 1,
  setAuctions: (auctions) =>
    set((state) => ({
      auctionList: auctions,
    })),

  setPage: (newPage) => set({ page: newPage }),

  resetAuctions: () => set({ auctionList: [], page: 1 }),
}));
