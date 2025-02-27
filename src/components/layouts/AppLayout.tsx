"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AUTH_ROUTES } from "@/routes/AuthRoutes";
import { useQuerySurvey } from "@/hooks/useQuerySurvey";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import { getOrCreateDeviceId, sanitizeStrapiData } from "@/shared/Utilies";
import { useQueryIpAddressSurvey } from "@/hooks/useQueryIpAddressSurvey";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/shared/Constants";
import { updateActiveSurveyStorageStatus } from "@/helpers/SurveyHelper";

const AppLayout = (props: { children: React.ReactNode }) => {
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

  const isAuthenticated = !!userData;
  const { data } = useQuerySurvey();
  const { setSurveyData, updateIpAddressStatus, updateUserSurveyData } =
    useSurveyStore();

  // Extract surveyId from data (assuming `data.data` contains the survey details)
  const surveyId = data?.data?.[0]?.id; // Adjust based on actual response structure

  // Pass surveyId to the hook
  const { data: dataIpAddressSurvey } = useQueryIpAddressSurvey(surveyId);

  useEffect(() => {
    getOrCreateDeviceId();
    if (data?.data) {
      const result = sanitizeStrapiData(data.data);
      setSurveyData(result);
    }
  }, [data, setSurveyData]);

  useEffect(() => {
    if (dataIpAddressSurvey?.data) {
      const response = sanitizeStrapiData(dataIpAddressSurvey.data)?.[0];
      const resultStatus =
        dataIpAddressSurvey.data?.length > 0 ? response?.status : null;
      // console.log("dataIpAddressSurvey", { resultStatus, response });

      updateIpAddressStatus(resultStatus);
      updateActiveSurveyStorageStatus(surveyId, resultStatus);
      updateUserSurveyData(response);
    }
  }, [
    dataIpAddressSurvey,
    updateIpAddressStatus,
    updateUserSurveyData,
    isAuthenticated,
    surveyId,
  ]);

  const { children } = props;
  const pathname = usePathname();

  const isAuthRoute = AUTH_ROUTES.some((route: any) => route.path === pathname);

  const renderChildren = () => {
    return (
      <div
        className={`flex-1 ${
          isAuthRoute ? "flex items-center justify-center" : ""
        } `}
      >
        {children}
      </div>
    );
  };
  return <>{renderChildren()}</>;
};

export default AppLayout;
