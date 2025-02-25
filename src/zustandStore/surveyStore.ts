import { ISurvey } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  surveyData: ISurvey[] | null;
  ipAdderssStatus: "COMPLETED" | "REMIND_LATER" | null;
};

type Action = {
  setSurveyData: (payload: ISurvey[]) => void;
  updateIpAddressStatus: (payload: "COMPLETED" | "REMIND_LATER") => void;
};

export interface ISurveyStore extends State, Action {}

export const useSurveyStore = create<ISurveyStore>()(
  devtools((set) => ({
    surveyData: null,
    ipAdderssStatus: null,
    setSurveyData: (payload: ISurvey[]) => {
      set({ surveyData: payload });
    },
    updateIpAddressStatus: (payload: "COMPLETED" | "REMIND_LATER") => {
      set({ ipAdderssStatus: payload });
    },
  }))
);
