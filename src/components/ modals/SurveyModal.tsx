import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { useSurveyModal } from "@/hooks/useSurveyModal";
import { useSurvey } from "@/hooks/useSurvey";
import SurveyQuestion from "../atoms/SurveyQuestion";
import logo from "@/assets/images/logo.png";
import _ from "lodash";

interface ISurveyModal {
  openModal: boolean;
  hideModal?: () => void;
}

const SurveyModal = ({ openModal, hideModal = () => {} }: ISurveyModal) => {
  const { handleContinue, handleReminder } = useSurveyModal();
  const {
    currentQuestion,
    currentIndex,
    responses,
    handleNext,
    handleChange,
    handlePrevious,
  } = useSurvey();
  const [showSurvey, setShowSurvey] = useState(false);

  const remainderHandler = () => {
    hideModal();
    handleReminder();
  };

  const continueHandler = () => {
    if (!_.isObject(currentQuestion)) {
      hideModal();
      return;
    }
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
    console.log("currentQuestion", {
      currentQuestion,
      cq: _.isObject(currentQuestion),
    });

    if (showSurvey && _.isObject(currentQuestion)) {
      return (
        <>
          <div className="p-6">
            <SurveyQuestion
              question={currentQuestion.question ?? ""}
              options={currentQuestion.options}
              type={
                currentQuestion.type as
                  | "single-choice"
                  | "multiple-choice"
                  | "open-ended"
              }
              response={responses[currentQuestion.question ?? ""]}
              onChange={handleChange}
            />

            <div
              className={`flex ${
                currentIndex !== 0 ? "justify-between" : "justify-end"
              } mt-6`}
            >
              {currentIndex !== 0 ? (
                <div
                  className="link text-brand-color underline"
                  onClick={handlePrevious}
                >
                  Back
                </div>
              ) : (
                ""
              )}

              <ActionButton
                text={currentIndex < 8 ? "Next" : "Finish"}
                onclick={handleNextHandler}
                isActionButton={true}
                disabled={!responses[currentQuestion.question]}
              />
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <p className="text-gray-600 text-lg px-6 pt-6">
          We&apos;d love your feedback!
        </p>

        <p className="px-6">
          Your opinion matters to us. Take a quick survey to help us improve
          your experience
        </p>

        <div className="flex flex-col justify-end gap-4 px-6 pb-6">
          <ActionButton
            text="Sure, I'll give feedback"
            onclick={continueHandler}
            isActionButton={true}
            customClass="bg-brand-color rounded-lg"
          />
          <ActionButton
            text="Remind me later"
            onclick={remainderHandler}
            isActionButton={false}
          />
        </div>
      </>
    );
  };

  return (
    <CustomModal
      openModal={openModal}
      isCrossVisible={true}
      onClose={hideModal}
      // modalHeading={showSurvey ? "Quick Survey" : "We Value Your Opinion!"}
      customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12 relative !p-0 "
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-brand-color flex items-center justify-center h-40 rounded-t-lg relative">
          <img
            src={logo.src}
            alt="logo"
            // className="h-16 absolute -bottom-[25px]"
            className="h-16"
          />
        </div>
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
