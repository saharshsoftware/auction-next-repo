import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { STRING_DATA } from "@/shared/Constants";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Form } from "formik";

interface ICancelSubscriptionConfirmationModal {
  readonly openModal: boolean;
  readonly hideModal: () => void;
  readonly onConfirm: () => void;
  readonly isLoading?: boolean;
}

const CONFIRMATION_TEXT = "CANCEL";
const CANCEL_SUBSCRIPTION_MESSAGE = "Are you sure you want to cancel your subscription? You will immediately lose access to premium features. This action cannot be undone.";

/**
 * Double confirmation modal for canceling subscription
 */
const CancelSubscriptionConfirmationModal: React.FC<ICancelSubscriptionConfirmationModal> = (
  props
) => {
  const { openModal, hideModal = () => {}, onConfirm = () => {}, isLoading = false } = props;
  const [respError, setRespError] = useState<string>("");

  const handleCancelSubscription = () => {
    setRespError("");
    onConfirm();
  };

  const handleHideModal = () => {
    if (!isLoading) {
      hideModal();
    }
  };

  return (
    <CustomModal
      openModal={openModal}
      modalHeading="Cancel Subscription"
      customWidthClass="md:w-[50%] sm:w-3/5 w-11/12"
      onClose={handleHideModal}
      isCrossVisible={!isLoading}
    >
      <div className="flex flex-col gap-2">
        <p className="text-left text-sm">
          {CANCEL_SUBSCRIPTION_MESSAGE}
        </p>
        <CustomFormikForm
          initialValues={{ confirmationText: STRING_DATA.EMPTY }}
          wantToUseFormikEvent={true}
          handleSubmit={handleCancelSubscription}
        >
          {({ values }: any) => (
            <Form>
              <div className="flex flex-col gap-4">
                <TextField
                  type="text"
                  name="confirmationText"
                  placeholder={`Type '${CONFIRMATION_TEXT}' to confirm`}
                />
                {respError ? (
                  <span className="text-center text-sm text-red-700">
                    {respError}
                  </span>
                ) : null}
                <div className="flex justify-end items-center">
                  <div className="flex justify-end items-center gap-4">
                    <ActionButton
                      text={STRING_DATA.CANCEL}
                      onclick={handleHideModal}
                      customClass="btn btn-sm"
                      isActionButton={false}
                      disabled={isLoading}
                    />

                    <ActionButton
                      text={STRING_DATA.CANCEL_SUBSCRIPTION}
                      isLoading={isLoading}
                      isSubmit={true}
                      disabled={values?.confirmationText !== CONFIRMATION_TEXT || isLoading}
                      isDeleteButton={true}
                      customClass="btn btn-sm h-full min-w-24"
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </CustomFormikForm>
      </div>
    </CustomModal>
  );
};

export default CancelSubscriptionConfirmationModal;

