import { IAuction } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  auctionDetailsData: IAuction | null;
};

type Action = {
  setAuctionDetailData: (payload: IAuction) => void;
};

export interface IAuctionDetailsStore extends State, Action {}

export const useAuctionDetailsStore = create<IAuctionDetailsStore>()(
  devtools((set) => ({
    auctionDetailsData: null,
    setAuctionDetailData: (payload: IAuction) => {
      set({ auctionDetailsData: payload });
    },
  }))
);
