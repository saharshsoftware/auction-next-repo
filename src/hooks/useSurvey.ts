import { use, useState } from "react";
import { COOKIES, STORAGE_KEYS } from "@/shared/Constants";
import { useMutation } from "@tanstack/react-query";
import { updateUserSurveys, userSurveys } from "@/services/survey";
import { getIPAddress } from "@/shared/Utilies";
import { getCookie } from "cookies-next";
import { useSurveyStore } from "@/zustandStore/surveyStore";

export function useSurvey() {
  // const { questions } = surveyData;
  const surveyStoreData = useSurveyStore((state) => state.surveyData) ?? null;
  const userSurveyData =
    useSurveyStore((state) => state.userSurveyData) ?? null;
  const questions = surveyStoreData?.[0]?.questions ?? [];
  // console.log("Questions", questions);
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  // Mutations
  const { mutate } = useMutation({
    mutationFn: userSurveys,
    onSettled: async (data) => {
      console.log(data);
    },
  });

  const { mutate: mutateUserSurveys } = useMutation({
    mutationFn: updateUserSurveys,
    onSettled: async (data) => {
      console.log(data);
    },
  });

  const handleSurveyApiCall = async (payload: any) => {
    if (userSurveyData?.id) {
      mutateUserSurveys({ body: payload, userSurveyId: userSurveyData?.id });
      return;
    }
    mutate(payload);
  };

  const currentQuestion = questions?.[currentIndex] ?? "";

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
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

  const getPayloadData = async () => {
    const ipAddress = await getIPAddress();
    return {
      ipAddress,
      user: userData?.id,
      answers: Object.values(responses),
      survey: surveyStoreData?.[0]?.id ?? "",
      status: "COMPLETED" as "COMPLETED" | "REMIND_LATER",
    };
  };

  const handleSubmit = async () => {
    console.log("Survey Responses:", responses);
    const payload = await getPayloadData();
    console.log("(useSurvey :: ) payload data:", payload);
    handleSurveyApiCall(payload);
  };

  return {
    currentQuestion,
    currentIndex,
    responses,
    handleNext,
    handleChange,
    handlePrevious,
  };
}
