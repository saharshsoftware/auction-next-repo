import { ISurvey, IUserSurvey, USER_SURVEY_STATUS } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  surveyData: ISurvey[] | null;
  ipAdderssStatus: USER_SURVEY_STATUS | null;
  userSurveyData: IUserSurvey | null;
};

type Action = {
  setSurveyData: (payload: ISurvey[]) => void;
  updateIpAddressStatus: (payload: USER_SURVEY_STATUS) => void;
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
    updateIpAddressStatus: (payload: USER_SURVEY_STATUS) => {
      set({ ipAdderssStatus: payload });
    },
    updateUserSurveyData: (payload: IUserSurvey) => {
      set({ userSurveyData: payload });
    },
  }))
);
