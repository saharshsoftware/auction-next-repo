import { getActiveSurvey } from "@/services/survey";
import { REACT_QUERY } from "@/shared/Constants";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook for fetching and transforming news categories.
 */
export const useQuerySurvey = () => {
  return useQuery({
    queryKey: [REACT_QUERY.SURVEYS],
    queryFn: getActiveSurvey,
    staleTime: 0,
  });
};
