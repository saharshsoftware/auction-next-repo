import { getActiveSurvey, getIPAddressSurveyStatus } from "@/services/survey";
import { REACT_QUERY } from "@/shared/Constants";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook for fetching survey status based on IP address.
 */
export const useQueryIpAddressSurvey = (surveyId?: string) => {
  return useQuery({
    queryKey: [REACT_QUERY.USERS_SURVEYS, surveyId], // Include surveyId in the key
    queryFn: () =>
      surveyId ? getIPAddressSurveyStatus(surveyId) : Promise.resolve(null), // Avoid unnecessary calls
    enabled: !!surveyId, // Only fetch if surveyId is valid
    staleTime: 0,
  });
};
