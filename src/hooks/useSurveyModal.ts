import { handleRemindMeLater } from "@/helpers/SurveyHelper";
import { STORAGE_KEYS } from "@/shared/Constants";
import { useState } from "react";

export function useSurveyModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEYS.SURVEY_SHOWN_KEY, "true"); // Set survey shown flag
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEYS.SURVEY_DISMISS_KEY, "true");
    setIsModalOpen(false);
  };

  const handleReminder = () => {
    handleRemindMeLater();
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
    handleReminder,
  };
}
