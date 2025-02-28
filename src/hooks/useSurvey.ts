import { useState } from "react";
import { COOKIES, STORAGE_KEYS } from "@/shared/Constants";
import { useMutation } from "@tanstack/react-query";
import { updateUserSurveys, userSurveys } from "@/services/survey";
import { getOrCreateDeviceId } from "@/shared/Utilies";
import { getCookie } from "cookies-next";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import {
  getActiveSurveyStorageStatus,
  setActiveSurveyStorageStatus,
  updateActiveSurveyStorageStatus,
} from "@/helpers/SurveyHelper";
import { useRouter } from "next/navigation";

export function useSurvey(hideModalFn?: () => void) {
  const router = useRouter();
  // const { questions } = surveyData;
  const surveyStoreData = useSurveyStore((state) => state.surveyData) ?? null;
  const userSurveyData =
    useSurveyStore((state) => state.userSurveyData) ?? null;
  const questions = surveyStoreData?.[0]?.questions ?? [];
  // console.log("Questions", questions);
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const isAuthenticated = !!userData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  // Mutations
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

  const handleSurveyApiCall = async (payload: any) => {
    if (isAuthenticated) {
      if (userSurveyData?.id) {
        mutateUserSurveys({ body: payload, userSurveyId: userSurveyData?.id });
        return;
      }
      mutate(payload);
    } else {
      const hasEntryExist =
        getActiveSurveyStorageStatus(surveyStoreData?.[0]?.id ?? "") !== null;
      console.log("hasEntryExist", hasEntryExist);
      if (hasEntryExist && userSurveyData?.id) {
        mutateUserSurveys({ body: payload, userSurveyId: userSurveyData?.id });
        return;
      }
      mutate(payload);
    }
  };

  const currentQuestion = questions?.[currentIndex] ?? "";

  const handleNext = (email?: string, phone?: string) => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit(email ?? "", phone ?? "");
      localStorage.removeItem(STORAGE_KEYS.AUCTION_VIEW_KEY);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return 0;
      }
      return prev - 1;
    });
  };

  const handleChange = (value: any) => {
    // setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }));
    // console.log("Value", { value, responses });
    setResponses((prev) => ({ ...prev, [currentQuestion.question]: value }));
  };

  const getPayloadData = async (email: string, phone: string) => {
    const deviceId = getOrCreateDeviceId();
    return {
      user: userData?.id,
      answers: Object.values(responses),
      survey: surveyStoreData?.[0]?.id ?? "",
      status: "COMPLETED" as "COMPLETED" | "REMIND_LATER",
      deviceId,
      ...(email && { email }),
      ...(phone && { phone }),
    };
  };

  const handleSubmit = async (email?: string, phone?: string) => {
    console.log("Survey Responses:", responses);
    const payload = await getPayloadData(email ?? "", phone ?? "");
    console.log("(useSurvey :: ) payload data:", payload);
    handleSurveyApiCall(payload);
    if (!isAuthenticated) {
      setActiveSurveyStorageStatus(surveyStoreData?.[0]?.id ?? "", "COMPLETED");
    }
  };

  return {
    currentQuestion,
    currentIndex,
    responses,
    handleNext,
    handleChange,
    handlePrevious,
    isPendingRemainLater,
    isPendingFinished,
  };
}
