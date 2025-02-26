import { getActiveSurvey, getIPAddressSurveyStatus } from "@/services/survey";
import { COOKIES, REACT_QUERY } from "@/shared/Constants";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

/**
 * Custom hook for fetching survey status based on IP address.
 */
export const useQueryIpAddressSurvey = (surveyId?: string) => {
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

  const isAuthenticated = !!userData;

  // console.log("(useQueryIpAddressSurvey) userData", {
  //   isAuthenticated,
  //   userData,
  // });

  return useQuery({
    queryKey: [REACT_QUERY.USERS_SURVEYS, surveyId], // Include surveyId in the key
    queryFn: () =>
      surveyId
        ? getIPAddressSurveyStatus({
            surveyId,
            isAuthenticated,
            userId: userData?.id,
          })
        : Promise.resolve(null), // Avoid unnecessary calls
    enabled: !!surveyId, // Only fetch if surveyId is valid
    staleTime: 0,
  });
};
