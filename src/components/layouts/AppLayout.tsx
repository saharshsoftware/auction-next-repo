"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AUTH_ROUTES } from "@/routes/AuthRoutes";
import { useQuerySurvey } from "@/hooks/useQuerySurvey";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import { getOrCreateDeviceId, sanitizeStrapiData } from "@/shared/Utilies";
import { getCookie } from "cookies-next";
import { COOKIES } from "@/shared/Constants";
import { getOrCreateSurveyStorageData } from "@/helpers/SurveyHelper";

const AppLayout = (props: { children: React.ReactNode }) => {
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

  const isAuthenticated = !!userData;
  const { data } = useQuerySurvey();
  const { setSurveyData, updateIpAddressStatus, updateUserSurveyData } =
    useSurveyStore();

  useEffect(() => {
    getOrCreateDeviceId();
    if (data?.data) {
      const result = sanitizeStrapiData(data.data);
      getOrCreateSurveyStorageData(result?.[0]?.id);
      setSurveyData(result);
    }
  }, [data, setSurveyData]);

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
