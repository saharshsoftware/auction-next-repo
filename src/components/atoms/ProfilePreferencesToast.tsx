"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { hasBudgetRanges, hasValue } from "@/shared/Utilies";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/zustandStore/authStore";
import InlineWarningToast from "./inline-warning-toast";

/**
 * Component that displays a toast notification prompting users to complete their profile preferences.
 * Only shows when the user is authenticated and has incomplete preferences.
 */
const ProfilePreferencesToast: React.FC = () => {
  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const isAuthenticated = token.length > 0;
  const { userProfileData, isLoading: isLoadingUserProfile } = useUserProfile(isAuthenticated);
  const setNewUserStatus = useAuthStore((state) => state.setNewUserStatus);
  const [isProfileToastDismissed, setProfileToastDismissed] = useState<boolean>(false);

  const isProfileIncomplete = useMemo(() => {
    if (!userProfileData) {
      return false;
    }
    const hasCities = hasValue(userProfileData.interestedCities);
    const hasCategories = hasValue(userProfileData.interestedCategories);
    const hasBudgets = hasBudgetRanges(userProfileData.budgetRanges);
    return !(hasCities && hasCategories && hasBudgets);
  }, [userProfileData]);

  useEffect(() => {
    if (!isProfileIncomplete) {
      setProfileToastDismissed(false);
    }
  }, [isProfileIncomplete]);

  const shouldShowProfileToast =
    isAuthenticated &&
    !isLoadingUserProfile &&
    isProfileIncomplete &&
    !isProfileToastDismissed;

  if (!shouldShowProfileToast) {
    return null;
  }

  return (
    <InlineWarningToast
      title="Complete your preferences"
      description={STRING_DATA.PREFERENCES_MESSAGE}
      actionLabel="Update now"
      onAction={() => setNewUserStatus(true)}
      onClose={() => setProfileToastDismissed(true)}
    />
  );
};

export default ProfilePreferencesToast;

