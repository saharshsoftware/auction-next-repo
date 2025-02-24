import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { useSurveyModal } from "@/hooks/useSurveyModal";
import { useSurvey } from "@/hooks/useSurvey";
import SurveyQuestion from "../atoms/SurveyQuestion";

interface ISurveyModal {
  openModal: boolean;
  hideModal?: () => void;
}

const SurveyModal = ({ openModal, hideModal = () => {} }: ISurveyModal) => {
  const { handleContinue, handleSkip } = useSurveyModal();
  const { currentQuestion, currentIndex, responses, handleNext, handleChange } =
    useSurvey();
  const [showSurvey, setShowSurvey] = useState(false);

  const skiphandler = () => {
    hideModal();
    handleSkip();
  };

  const continueHandler = () => {
    // hideModal();
    handleContinue();
    setShowSurvey(true);
  };

  const handleNextHandler = () => {
    handleNext();
    if (currentIndex === 8) {
      hideModal();
    }
  };

  const renderSurveyQuestionContainer = () => {
    if (showSurvey) {
      return (
        <>
          <div className=" ">
            <SurveyQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              type={
                currentQuestion.type as
                  | "single-choice"
                  | "multiple-choice"
                  | "open-ended"
              }
              response={responses[currentQuestion.id]}
              onChange={handleChange}
            />

            <div className="flex justify-end mt-6">
              <ActionButton
                text={currentIndex < 8 ? "Next" : "Finish"}
                onclick={handleNextHandler}
                isActionButton={true}
                disabled={!responses[currentQuestion.id]}
              />
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <p className="text-gray-600 text-lg">
          Help us improve your auction experience by taking a quick survey.
        </p>

        <div className="flex justify-end gap-4">
          <ActionButton
            text="Continue"
            onclick={continueHandler}
            isActionButton={true}
          />
          <ActionButton
            text="Skip"
            onclick={skiphandler}
            isActionButton={false}
          />
        </div>
      </>
    );
  };

  return (
    <CustomModal
      openModal={openModal}
      modalHeading={showSurvey ? "Quick Survey" : "We Value Your Opinion!"}
      customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12 relative"
    >
      <div className="flex flex-col gap-4 ">
        {showSurvey && (
          <div className="absolute top-2 right-2 p-2">
            {currentIndex + 1} of 9
          </div>
        )}
        {renderSurveyQuestionContainer()}
      </div>
    </CustomModal>
  );
};

export default SurveyModal;
