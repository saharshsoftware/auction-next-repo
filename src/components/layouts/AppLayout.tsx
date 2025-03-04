"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AUTH_ROUTES } from "@/routes/AuthRoutes";
import { useQuerySurvey } from "@/hooks/useQuerySurvey";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import { getOrCreateDeviceId, sanitizeStrapiData } from "@/shared/Utilies";
import {
  checkSurveyTrigger,
  getOrCreateSurveyStorageData,
  incrementCounter,
  isRemindLaterValid,
} from "@/helpers/SurveyHelper";

import useModal from "@/hooks/useModal";
import SurveyModal from "../ modals/SurveyModal";
import { STORAGE_KEYS } from "@/shared/Constants";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { openModal, showModal, hideModal } = useModal();
  const { data } = useQuerySurvey();
  const { setSurveyData } = useSurveyStore();
  const pathname = usePathname();

  // Extract survey ID safely
  const surveyId = data?.data?.[0]?.id || null;

  useEffect(() => {
    if (surveyId) {
      getOrCreateSurveyStorageData(surveyId);
    }
    const surveyKey = `${STORAGE_KEYS.SURVEY_SHOWN}${surveyId}`; // Unique key per survey
    let surveyStatus = JSON.parse(localStorage.getItem(surveyKey) || "{}") as {
      status: "COMPLETED" | "REMIND_LATER" | "null";
    } | null;

    const isPendingRemainLater =
      surveyStatus?.status === "REMIND_LATER" && isRemindLaterValid(surveyId);
    const hasNullStatus = surveyStatus?.status === null;

    console.table({
      isPendingRemainLater,
      hasNullStatus,
    });
    if (hasNullStatus || isPendingRemainLater) {
      incrementCounter(STORAGE_KEYS.PAGE_VIEWS);
      checkSurveyTrigger(surveyId, showModal);
    }
  }, [pathname, surveyId]); // Runs every time user navigates to a new page

  useEffect(() => {
    try {
      getOrCreateDeviceId();

      if (surveyId) {
        getOrCreateSurveyStorageData(surveyId);
        setSurveyData(sanitizeStrapiData(data.data));
      }
    } catch (error) {
      console.error("Error initializing survey data:", error);
    }
  }, [surveyId, setSurveyData]);

  const isAuthRoute = AUTH_ROUTES.some((route) => route.path === pathname);

  return (
    <div
      className={`flex-1 ${
        isAuthRoute ? "flex items-center justify-center" : ""
      }`}
    >
      {children}
      {openModal && <SurveyModal openModal={openModal} hideModal={hideModal} />}
    </div>
  );
};

export default AppLayout;
