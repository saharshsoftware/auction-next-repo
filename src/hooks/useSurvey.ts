import { useState } from "react";
import surveyData from "@/data/survey.json"; // Import survey JSON
import { STORAGE_KEYS } from "@/shared/Constants";
import { useMutation } from "@tanstack/react-query";
import { userSurveys } from "@/services/survey";

export function useSurvey() {
  const { questions } = surveyData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: userSurveys,
    onSettled: async (data) => {
      console.log(data);
    },
  });

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
      localStorage.removeItem(STORAGE_KEYS.AUCTION_VIEW_KEY);
    }
  };

  const handleChange = (value: any) => {
    // setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }));
    // console.log("Value", { value, responses });
    setResponses((prev) => ({ ...prev, [currentQuestion.question]: value }));
  };

  const handleSubmit = () => {
    console.log("Survey Responses:", responses);
    // Send responses to API or handle submission logic
    const payload = {
      ipAddress: "",
      user: "",
      answer: responses,
    };
    mutate(payload);
  };

  return { currentQuestion, currentIndex, responses, handleNext, handleChange };
}
