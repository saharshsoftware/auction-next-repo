import { useState, useEffect } from "react";
import { setActiveSurveyStorageStatus, shouldShowSurveyOnAuctionList, shouldShowSurveyOnAuctionDetail } from "@/helpers/SurveyHelper";
import { useQuerySurvey } from "@/hooks/useQuerySurvey";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import { sanitizeStrapiData } from "@/shared/Utilies";

interface UseSurveyDisplayProps {
  surveyId?: string;
  isRandom?: boolean;
  isAuctionDetail?: boolean;
  pageNumber?: number;
}

export const useSurveyDisplay = ({ 
  surveyId, 
  isRandom = false, 
  isAuctionDetail = false,
  pageNumber = 0
}: UseSurveyDisplayProps) => {
  const { data } = useQuerySurvey();
  const { setSurveyData } = useSurveyStore();
  const [isVisible, setIsVisible] = useState(false);

  // Get survey ID from props or from API data
  const currentSurveyId = surveyId || data?.data?.[0]?.id || null;

  useEffect(() => {
    if (typeof window === "undefined" || !currentSurveyId) return;

    // Initialize survey data
    if (currentSurveyId) {
      setSurveyData(sanitizeStrapiData(data?.data, true));
    }

      let shouldDisplay = false;
      
      if (isAuctionDetail) {
        // For auction detail pages, always show
        shouldDisplay = shouldShowSurveyOnAuctionDetail();
      } else if (isRandom) {
        // For auction list pages, check page number
        shouldDisplay = shouldShowSurveyOnAuctionList(pageNumber);
      }
      
      if (shouldDisplay) {
        setIsVisible(true)
      }
  }, [currentSurveyId, isRandom, isAuctionDetail, pageNumber, setSurveyData, data?.data]);

  const handleMaybeLater = () => {
    if (currentSurveyId) {
      // Set REMIND_LATER status with current timestamp to reset the timer
      setActiveSurveyStorageStatus(currentSurveyId, "REMIND_LATER");
    }
    setIsVisible(false);
  };

  return {
    isVisible,
    handleMaybeLater,
    currentSurveyId
  };
}; 