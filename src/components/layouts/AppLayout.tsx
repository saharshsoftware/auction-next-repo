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
import ProfileCompletionModal from "../ modals/ProfileCompletionModal";
import { COOKIES, STORAGE_KEYS } from "@/shared/Constants";
import { USER_SURVEY_STATUS } from "@/types";
import { setUserIdInDataLayer } from "@/helpers/WindowHelper";
import { getCookie } from "cookies-next";
import { useAuthStore } from "@/zustandStore/authStore";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AppLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { openModal, showModal, hideModal } = useModal();
  const { openModal: openProfileModal, showModal: showProfileModal, hideModal: hideProfileModal } = useModal();
  const { data } = useQuerySurvey();
  const { setSurveyData } = useSurveyStore();
  const pathname = usePathname();
  const { isNewUser } = useAuthStore();
  const token = getCookie(COOKIES.TOKEN_KEY);
  const isAuthenticated = !!token;
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

  // Extract survey ID safely
  const surveyId = data?.data?.[0]?.id || null;

  useEffect(() => {
    if (typeof window === "undefined" || !surveyId) return;

    if (surveyId) {
      getOrCreateSurveyStorageData(surveyId);
    }
    const surveyKey = `${STORAGE_KEYS.SURVEY_SHOWN}${surveyId}`; // Unique key per survey
    let surveyStatus = JSON.parse(localStorage.getItem(surveyKey) || "{}") as {
      status: USER_SURVEY_STATUS;
    } | null;

    const isPendingRemainLater =
      (surveyStatus?.status === "REMIND_LATER" ||
        surveyStatus?.status === "INCOMPLETE") &&
      isRemindLaterValid(surveyId);
    const hasNullStatus = surveyStatus?.status === null;

    if (hasNullStatus || isPendingRemainLater) {
      incrementCounter(STORAGE_KEYS.PAGE_VIEWS);
      checkSurveyTrigger(surveyId, showModal);
    }
  }, [pathname, surveyId]); // Runs every time user navigates to a new page

  useEffect(() => {
    if (typeof window === "undefined" || !surveyId) return;

    try {
      getOrCreateDeviceId();

      if (surveyId) {
        getOrCreateSurveyStorageData(surveyId);
        setSurveyData(sanitizeStrapiData(data.data, true));
      }
    } catch (error) {
      console.error("Error initializing survey data:", error);
    }
  }, [surveyId, setSurveyData]);

  useEffect(() => {
    const userId = userData?.id ? String(userData.id) : null;
    setUserIdInDataLayer(isAuthenticated ? userId : null);
  }, [isAuthenticated, userData?.id]);

  // Open profile completion modal for new users or users with incomplete profiles
  useEffect(() => {
    if (isAuthenticated && isNewUser) {
      showProfileModal();
    }
  }, [isNewUser, isAuthenticated]);

  // Global scroll to top behavior
  useScrollToTop({
    scrollOnRouteChange: true,
    scrollOnSearchChange: true,
    preserveOnBack: true
  });

  const isAuthRoute = AUTH_ROUTES.some((route) => route.path === pathname);

  const handleCloseProfileModal = () => {
    hideProfileModal();
    useAuthStore.getState().setNewUserStatus(false);
  };

  return (
    <div
      className={`flex-1 ${isAuthRoute ? "flex items-center justify-center" : ""
        }`}
    >
      {children}
      {openModal && <SurveyModal openModal={openModal} hideModal={hideModal} />}
      {openProfileModal && (
        <ProfileCompletionModal
          openModal={openProfileModal}
          hideModal={handleCloseProfileModal}
        />
      )}
    </div>
  );
};

export default AppLayout;
