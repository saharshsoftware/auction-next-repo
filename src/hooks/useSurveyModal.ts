import {
  handleRemindMeLater,
  setActiveSurveyStorageStatus,
  updateActiveSurveyStorageStatus,
} from "@/helpers/SurveyHelper";
import { updateUserSurveys, userSurveys } from "@/services/survey";
import { COOKIES } from "@/shared/Constants";
import { getIPAddress, getOrCreateDeviceId } from "@/shared/Utilies";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSurveyModal(hideModalFn?: () => void) {
  const router = useRouter();
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const isAuthenticated = !!userData;
  const surveyStoreData = useSurveyStore((state) => state.surveyData) ?? null;
  const userSurveyData =
    useSurveyStore((state) => state.userSurveyData) ?? null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mutations
  const { mutate: mutateUserSurveys, isPending: isPendingRemainLater } =
    useMutation({
      mutationFn: updateUserSurveys,
      onSuccess: (data: any) => {
        // console.log("(INFO:: onSuccess)", data);
        const survey_status = data?.data?.attributes?.status ?? null;
        updateActiveSurveyStorageStatus(
          surveyStoreData?.[0]?.id ?? "",
          survey_status
        );
        hideModalFn?.();
      },
      onSettled: async (data) => {
        console.log(data);
      },
    });

  const { mutate, isPending: isPendingFinished } = useMutation({
    mutationFn: userSurveys,
    onSuccess: (data: any) => {
      // console.log("(INFO:: onSuccess)", data);
      const survey_status = data?.data?.attributes?.status ?? null;
      updateActiveSurveyStorageStatus(
        surveyStoreData?.[0]?.id ?? "",
        survey_status
      );
      hideModalFn?.();
    },
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
    const deviceId = getOrCreateDeviceId();
    return {
      ipAddress,
      user: userData?.id,
      survey: surveyStoreData?.[0]?.id ?? "",
      status: "REMIND_LATER" as "COMPLETED" | "REMIND_LATER",
      deviceId,
    };
  };

  const handleSkip = () => {
    setIsModalOpen(false);
  };

  const handleReminder = async () => {
    handleRemindMeLater();
    const payload = await getPayloadData();
    console.log("(useSurvey :: ) payload data:", payload);
    if (isAuthenticated) {
      handleSurveyApiCall(payload);
    } else {
      setActiveSurveyStorageStatus(
        surveyStoreData?.[0]?.id ?? "",
        "REMIND_LATER"
      );
    }
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
    isPendingFinished,
    isPendingRemainLater,
  };
}
