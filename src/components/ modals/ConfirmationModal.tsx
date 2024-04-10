import React from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { STRING_DATA } from "@/shared/Constants";

interface IConfirmationModal {
  message: string;
  openModal: boolean;
  actionLabel: string;
  hideModal: () => void;
  onActionClick: () => void;
  loading?: boolean;
}

const ConfirmationModal: React.FC<IConfirmationModal> = (props) => {
  const {
    openModal,
    hideModal = () => {},
    onActionClick = () => {},
    message,
    actionLabel,
    loading,
  } = props;
  return (
    <CustomModal
      openModal={openModal}
      customWidthClass="md:w-[30%] sm:w-3/5 w-11/12"
    >
      <div className="flex flex-col gap-2">
        <h2 className="custom-h2-class text-center text-4xl">
          {STRING_DATA.CONFIRMATION}
        </h2>
        <p className="font-bold text-left my-2">{message}</p>
        <div className="flex justify-end items-center">
          <div className="flex justify-end items-center gap-4">
            <ActionButton
              text={"Cancel"}
              onclick={hideModal}
              customClass="btn btn-sm"
              isActionButton={false}
            />

            <ActionButton
              text={actionLabel}
              isLoading={loading}
              onclick={onActionClick}
              isDeleteButton={true}
              customClass="btn btn-sm h-full min-w-24"
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmationModal;
