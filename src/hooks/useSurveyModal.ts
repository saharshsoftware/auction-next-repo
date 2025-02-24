import { STORAGE_KEYS } from "@/shared/Constants";
import { useState, useEffect } from "react";

export function useSurveyModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContinue = () => {
    // window.location.href = "/survey"; // Redirect to survey page
    // alert("Redirecting to survey page");
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEYS.SURVEY_DISMISS_KEY, "true");
    setIsModalOpen(false);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return {
    isModalOpen,
    handleContinue,
    handleSkip,
    hideModal,
    openModal,
  };
}
