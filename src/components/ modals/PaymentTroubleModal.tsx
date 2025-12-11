import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { reportPaymentFailure } from "@/services/subscription";
import { getCookie } from "cookies-next";
import { CONTACT_NUMBER, COOKIES } from "@/shared/Constants";
import { logError, logInfo } from "@/shared/Utilies";
import toast from "react-simple-toasts";

interface IPaymentTroubleModal {
  openModal: boolean;
  hideModal: () => void;
}

const PaymentTroubleModal: React.FC<IPaymentTroubleModal> = ({
  openModal,
  hideModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getUserId = (): number | null => {
    try {
      const userCookie = getCookie(COOKIES.AUCTION_USER_KEY);
      if (userCookie) {
        const userData = JSON.parse(userCookie as string);
        return userData?.id ? Number(userData.id) : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleYesClick = async () => {
    const userId = getUserId();
    if (!userId) {
      logError("Could not get user ID for payment failure report");
      hideModal();
      return;
    }

    setIsLoading(true);
    try {
      await reportPaymentFailure(userId);
      logInfo("Payment trouble reported successfully", { userId });
      toast("Thank you for letting us know. Our team will reach out to you shortly.", {
        duration: 4000,
        position: "top-center",
        theme: "success",
      });
    } catch (error) {
      logError("Failed to report payment trouble", error);
      toast("We couldn't submit your request. Please try contacting us directly.", {
        duration: 4000,
        position: "top-center",
        theme: "failure",
      });
    } finally {
      setIsLoading(false);
      hideModal();
    }
  };

  const handleNoClick = () => {
    hideModal();
  };

  return (
    <CustomModal
      openModal={openModal}
      modalHeading="Having Payment Trouble?"
      customWidthClass="md:w-[36%] sm:w-3/5 w-11/12"
      isCrossVisible={true}
      onClose={hideModal}
    >
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-3">
          <p className="text-left text-gray-700 text-sm leading-relaxed">
            We noticed you closed the payment window. If you experienced any issues during the payment process, 
            we&apos;re here to help!
          </p>
          <p className="text-left text-gray-600 text-sm">
            Would you like our support team to contact you regarding this payment?
          </p>
          <p className="text-left text-gray-600 text-sm">
            You can also call us at{" "}
            <a href={`tel:${CONTACT_NUMBER}`} className="font-medium text-blue-600">
              {CONTACT_NUMBER}
            </a>
          </p>
        </div>

        <div className="flex justify-end items-center gap-3 pt-2">
          <ActionButton
            text="No"
            onclick={handleNoClick}
            isActionButton={false}
            isOutline={true}
            customClass="btn btn-sm"
          />
          <ActionButton
            text="Yes"
            onclick={handleYesClick}
            isLoading={isLoading}
            isActionButton={true}
            customClass="btn btn-sm bg-blue-600 hover:bg-blue-700"
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default PaymentTroubleModal;

