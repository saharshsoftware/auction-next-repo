import React from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";

interface IInfoModal {
  message: string;
  openModal: boolean;
  hideModal: () => void;
  buttonLabel?: string;
}

const InfoModal: React.FC<IInfoModal> = ({
  openModal,
  hideModal = () => { },
  message,
  buttonLabel = "Got it",
}) => {
  return (
    <CustomModal
      openModal={openModal}
      modalHeading="Plan Switch Information"
      customWidthClass="md:w-[32%] sm:w-3/5 w-11/12"
      isCrossVisible={true}
      onClose={hideModal}
    >
      <div className="flex flex-col gap-4">
        <p className="text-left text-gray-700 text-sm">{message}</p>
        <div className="flex justify-end items-center">
          <ActionButton
            text={buttonLabel}
            onclick={hideModal}
            customClass="btn btn-sm bg-blue-600 hover:bg-blue-700"
            isActionButton={true}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default InfoModal;

