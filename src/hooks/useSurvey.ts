import { useState } from "react";
import { COOKIES, STORAGE_KEYS } from "@/shared/Constants";
import { useMutation } from "@tanstack/react-query";
import { updateUserSurveys, userSurveys } from "@/services/survey";
import { getOrCreateDeviceId } from "@/shared/Utilies";
import { getCookie } from "cookies-next";
import { useSurveyStore } from "@/zustandStore/surveyStore";
import {
  getActiveSurveyStorageStatus,
  removeDownstreamResponses,
  setActiveSurveyStorageStatus,
  updateActiveSurveyStorageStatus,
} from "@/helpers/SurveyHelper";
import { useRouter } from "next/navigation";
import _ from "lodash";
import surveyData from "@/data/survey.json";
import { ISurveyOptions, Question } from "@/types";

export function useSurvey(hideModalFn?: () => void) {
  const router = useRouter();
  // const { questions } = surveyData as any;
  const surveyStoreData = useSurveyStore((state) => state.surveyData) ?? null;
  const userSurveyData =
    useSurveyStore((state) => state.userSurveyData) ?? null;
  const questions = surveyStoreData?.[0]?.questions;
  // console.log("Questions", questions);
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const isAuthenticated = !!userData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionKey, setQuestionKey] = useState("q1");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [responsePayload, setResponsePayload] = useState<any>({});

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
    const hasEntryExist =
      getActiveSurveyStorageStatus(surveyStoreData?.[0]?.id ?? "") !== null;
    console.log("hasEntryExist", hasEntryExist, responses);
    // I want to check if response if empty object using lodash
    if (_.isEmpty(responses)) {
      console.log("Question-response is empty", responses);
      setActiveSurveyStorageStatus(
        surveyStoreData?.[0]?.id ?? "",
        "REMIND_LATER"
      );
      hideModalFn?.();
      return;
    }
    mutate(payload);
  };

  // const currentQuestion: any = questions?.[currentIndex] ?? "";
  const currentQuestion: Question =
    questions?.[questionKey] ?? ({} as Question);

  const getCurrentQuestion = (): ISurveyOptions => {
    const currentQuestionData = questions?.[questionKey];
    const question = currentQuestionData?.question;
    // console.log("Current Question Data", {
    //   currentQuestionData,
    //   responses,
    //   questionKey,
    //   questions,
    // });
    if (currentQuestionData && question && responses[question]) {
      if (currentQuestionData.type === "multiple-choice") {
        const selectedOption = currentQuestionData?.options?.find(
          (option: ISurveyOptions) =>
            responses[question]?.includes(option.label)
        );
        return (
          selectedOption ?? {
            label: "",
            next: "",
            prev: "",
          }
        );
      }
      const selectedOption = currentQuestionData?.options?.find(
        (option: ISurveyOptions) => option.label === responses[question]
      );
      return (
        selectedOption ?? {
          label: "",
          next: "",
          prev: "",
        }
      );
    }
    return {
      label: "",
      next: "",
      prev: "",
    };
  };

  const handleNext = (email?: string, phone?: string) => {
    const currentQuestionData = questions?.[questionKey];

    // Find the next question key based on the user's response
    const selectedOption = getCurrentQuestion();

    const nextQuestionKey = selectedOption?.next;
    console.log("Current Question Data >>>>>>>>>>>>>>>>>>>>>>>>", {
      currentQuestionData,
      responses,
      nextQuestionKey,
    });
    if (nextQuestionKey && questions?.[nextQuestionKey]) {
      setQuestionKey(nextQuestionKey); // Update questionKey instead of currentIndex
    } else if (nextQuestionKey === "end") {
      console.log("Survey Completed - API will hit");
      // handleSubmit(email ?? "", phone ?? "");
    } else {
      console.log("Survey nextQuestionKey", { nextQuestionKey });
    }
  };

  const handlePrevious = (qId: string) => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return 0;
      }
      return prev - 1;
    });

    const currentQuestionData = questions?.[qId];
    let selectedOption: ISurveyOptions = {
      label: "",
      next: "",
      prev: "",
    };
    if (currentQuestionData) {
      selectedOption = currentQuestionData?.options[0];
    }
    // console.log("Selected Option handlePrevious", {
    //   selectedOption,
    //   currentQuestion,
    //   handleChange,
    // });
    setQuestionKey(selectedOption?.prev ?? "");
  };

  const handleChange = (value: any) => {
    // setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }));
    console.log("Value", { value, responses });

    if (currentQuestion.question) {
      setResponses((prev) => ({
        ...prev,
        [String(currentQuestion.question)]: value,
      }));
      const updateResponses = removeDownstreamResponses(
        currentQuestion,
        responses,
        questions
      );
      console.log("(INFO::)Updated Responses", updateResponses);
      setResponsePayload(updateResponses);
    }
  };

  const getPayloadData = async (email: string, phone: string) => {
    const deviceId = getOrCreateDeviceId();

    return {
      user: userData?.id,
      answers: responsePayload,
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
    // if (!isAuthenticated) {
    //   setActiveSurveyStorageStatus(surveyStoreData?.[0]?.id ?? "", "COMPLETED");
    // }
  };

  return {
    currentQuestion,
    currentIndex,
    responses,
    handleNext,
    handleChange,
    handleSubmit,
    handlePrevious,
    isPendingRemainLater,
    isPendingFinished,
    questionKey,
    currentQuestionData: getCurrentQuestion(),
  };
}
