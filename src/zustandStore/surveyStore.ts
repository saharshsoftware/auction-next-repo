import { ISurvey, IUserSurvey } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  surveyData: ISurvey[] | null;
  ipAdderssStatus: "COMPLETED" | "REMIND_LATER" | null;
  userSurveyData: IUserSurvey | null;
};

type Action = {
  setSurveyData: (payload: ISurvey[]) => void;
  updateIpAddressStatus: (payload: "COMPLETED" | "REMIND_LATER") => void;
  updateUserSurveyData: (payload: IUserSurvey) => void;
};

export interface ISurveyStore extends State, Action {}

export const useSurveyStore = create<ISurveyStore>()(
  devtools((set) => ({
    surveyData: null,
    ipAdderssStatus: null,
    userSurveyData: null,
    setSurveyData: (payload: ISurvey[]) => {
      set({ surveyData: payload });
    },
    updateIpAddressStatus: (payload: "COMPLETED" | "REMIND_LATER") => {
      set({ ipAdderssStatus: payload });
    },
    updateUserSurveyData: (payload: IUserSurvey) => {
      set({ userSurveyData: payload });
    },
  }))
);
