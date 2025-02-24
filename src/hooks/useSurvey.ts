import { useState } from "react";
import surveyData from "@/data/survey.json"; // Import survey JSON

export function useSurvey() {
  const { questions } = surveyData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleChange = (value: any) => {
    setResponses((prev) => ({ ...prev, [currentQuestion.question]: value }));
  };

  const handleSubmit = () => {
    console.log("Survey Responses:", responses);
    // Send responses to API or handle submission logic
  };

  return { currentQuestion, currentIndex, responses, handleNext, handleChange };
}
