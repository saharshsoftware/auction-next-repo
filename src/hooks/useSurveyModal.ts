import { handleRemindMeLater } from "@/helpers/SurveyHelper";
import { updateUserSurveys, userSurveys } from "@/services/survey";
import { COOKIES } from "@/shared/Constants";
import { getIPAddress } from "@/shared/Utilies";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useState } from "react";

export function useSurveyModal() {
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const surveyStoreData = useSurveyStore((state) => state.surveyData) ?? null;
  const userSurveyData =
    useSurveyStore((state) => state.userSurveyData) ?? null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mutations
  const { mutate: mutateUserSurveys } = useMutation({
    mutationFn: updateUserSurveys,
    onSettled: async (data) => {
      console.log(data);
    },
  });

  const { mutate } = useMutation({
    mutationFn: userSurveys,
    onSettled: async (data) => {
      console.log(data);
    },
  });
  const handleContinue = () => {
    // localStorage.setItem(STORAGE_KEYS.SURVEY_SHOWN_KEY, "true"); // Set survey shown flag
  };

  const handleSurveyApiCall = async (payload: any) => {
    if (userSurveyData?.id) {
      mutateUserSurveys({ body: payload, userSurveyId: userSurveyData?.id });
      return;
    }
    mutate(payload);
  };

  const getPayloadData = async () => {
    const ipAddress = await getIPAddress();
    return {
      ipAddress,
      user: userData?.id,
      survey: surveyStoreData?.[0]?.id ?? "",
      status: "REMIND_LATER" as "COMPLETED" | "REMIND_LATER",
    };
  };

  const handleSkip = () => {
    setIsModalOpen(false);
    const payload = getPayloadData();
    console.log("(useSurvey :: ) payload data:", payload);
    handleSurveyApiCall(payload);
  };

  const handleReminder = () => {
    handleRemindMeLater();
    const payload = getPayloadData();
    handleSurveyApiCall(payload);
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
