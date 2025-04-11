import React, { useState, useEffect } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { useSurveyModal } from "@/hooks/useSurveyModal";
import { useSurvey } from "@/hooks/useSurvey";
import SurveyQuestion from "../atoms/SurveyQuestion";
import logo from "@/assets/images/logo.png";
import _ from "lodash";
import Image from "next/image";
import EmailPhoneSurveyForm from "../molecules/EmailPhoneSurveyForm";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";

interface ISurveyModal {
  openModal: boolean;
  hideModal?: () => void;
}

const SurveyModal = ({ openModal, hideModal = () => {} }: ISurveyModal) => {
  const { handleReminder, isPendingRemainLater } = useSurveyModal(hideModal);
  const {
    currentQuestion,
    currentIndex,
    responses,
    handleNext,
    handleChange,
    handlePrevious,
    handleSubmit,
    isPendingFinished,
    questionKey,
    currentQuestionData,
  } = useSurvey(hideModal);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const isAuthenticated = !!userData;

  // Local state to trigger the transition (in case the modal stays mounted)
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (openModal) {
      // Delay a tick to allow the component to mount before applying the transition classes.
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [openModal]);

  const remainderHandler = () => {
    handleReminder();
  };

  const continueHandler = () => {
    if (!_.isObject(currentQuestion)) {
      hideModal();
      return;
    }
    setShowSurvey(true);
  };

  const handleNextHandler = () => {
    if (currentQuestionData.next !== "end") {
      handleNext();
    } else {
      isAuthenticated
        ? handleSubmit(STRING_DATA.EMPTY, STRING_DATA.EMPTY, true)
        : setShowContactForm(true);
    }
  };

  const renderSurveyQuestionContainer = () => {
    if (showSurvey && _.isObject(currentQuestion)) {
      return (
        <>
          <div className={`p-6 ${showContactForm ? "hidden" : ""}`}>
            <SurveyQuestion
              questionKey={questionKey}
              question={currentQuestion.question ?? ""}
              optionsData={currentQuestion?.options}
              type={
                currentQuestion.type as
                  | "single-choice"
                  | "multiple-choice"
                  | "open-ended"
              }
              response={responses[currentQuestion?.question ?? ""]}
              onChange={handleChange}
            />
            <div
              className={`flex ${
                questionKey !== "q1" ? "justify-between" : "justify-end"
              } mt-6`}
            >
              {questionKey !== "q1" && (
                <div
                  className="link text-brand-color underline"
                  onClick={() => handlePrevious(questionKey)}
                >
                  Back
                </div>
              )}
              <ActionButton
                text={currentQuestionData.next !== "end" ? "Next" : "Finish"}
                onclick={handleNextHandler}
                isActionButton={true}
                isLoading={isPendingFinished || isPendingRemainLater}
                disabled={!responses[currentQuestion?.question ?? ""]}
              />
            </div>
          </div>
          <div className={`${showContactForm ? "" : "hidden"}`}>
            <EmailPhoneSurveyForm
              isSubmitting={isPendingFinished}
              handleSubmit={(email, phone) => handleNext(email, phone, true)}
            />
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
          your experience.
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
            isLoading={isPendingRemainLater}
            isActionButton={false}
          />
        </div>
      </>
    );
  };

  const handleCrossClick = () => {
    hideModal();
    handleSubmit();
  };

  return (
    <CustomModal
      openModal={openModal}
      isCrossVisible={true}
      onClose={handleCrossClick}
      customWidthClass={`lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12 relative !p-0 transform transition-all duration-300 ease-out ${
        animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-brand-color flex items-center justify-center h-40 rounded-t-lg relative">
          <Image
            src={logo.src}
            alt="logo"
            width={200}
            height={100}
            objectFit="contain"
            objectPosition="center"
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
