import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { useSurveyModal } from "@/hooks/useSurveyModal";
import { useSurvey } from "@/hooks/useSurvey";
import SurveyQuestion from "../atoms/SurveyQuestion";
import logo from "@/assets/images/logo.png";
import _ from "lodash";
import Image from "next/image";
import EmailPhoneSurveyForm from "../molecules/EmailPhoneSurveyForm";
import { COOKIES } from "@/shared/Constants";
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
    isPendingFinished,
  } = useSurvey(hideModal);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;
  const isAuthenticated = !!userData;

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
    if (currentIndex < 8) {
      handleNext();
    } else {
      isAuthenticated ? handleNext() : setShowContactForm(true);
    }
  };

  const renderSurveyQuestionContainer = () => {
    if (showSurvey && _.isObject(currentQuestion)) {
      return (
        <>
          <div className={`p-6 ${showContactForm ? "hidden" : ""}`}>
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
              {currentIndex !== 0 && (
                <div
                  className="link text-brand-color underline"
                  onClick={handlePrevious}
                >
                  Back
                </div>
              )}
              <ActionButton
                text={currentIndex < 8 ? "Next" : "Finish"}
                onclick={handleNextHandler}
                isActionButton={true}
                isLoading={isPendingFinished || isPendingRemainLater}
                disabled={!responses[currentQuestion.question]}
              />
            </div>
          </div>
          <div className={`${showContactForm ? "" : "hidden"}`}>
            <EmailPhoneSurveyForm
              hideModalFn={hideModal}
              handleSubmit={handleNext}
            />
            ;
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
            isLoading={isPendingRemainLater}
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
      customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12 relative !p-0"
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
