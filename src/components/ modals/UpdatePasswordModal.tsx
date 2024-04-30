import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Form } from "formik";
import ActionCheckbox from "../atoms/ActionCheckbox";
import { ERROR_MESSAGE, STRING_DATA } from "../../shared/Constants";
import * as Yup from "yup";
import { handleOnSettled } from "@/shared/Utilies";
import { changePasswordServiceClient } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

interface IUpdatePasswordModal {
  openModal: boolean;
  hideModal: () => void;
}

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .trim()
    .min(6, ERROR_MESSAGE.MIN_6)
    .max(30, ERROR_MESSAGE.MAX_PASS_30)
    .required(ERROR_MESSAGE.PASSWORD_REQUIRED),
  newPassword: Yup.string()
    .trim()
    .min(6, ERROR_MESSAGE.MIN_6)
    .max(30, ERROR_MESSAGE.MAX_PASS_30)
    .required(ERROR_MESSAGE.NEW_PASSWORD_REQUIRED),
  confirmPassword: Yup.string()
    .trim()
    .required(ERROR_MESSAGE.CONFIRM_PASSWORD)
    .oneOf([Yup.ref("newPassword")], ERROR_MESSAGE.PASSWORDS_MUST_MATCH),
});

const initialValues = {
  currentPassword: STRING_DATA.EMPTY,
  newPassword: STRING_DATA.EMPTY,
  confirmPassword: STRING_DATA.EMPTY,
};

const UpdatePasswordModal: React.FC<IUpdatePasswordModal> = (
  props
) => {
  const { openModal, hideModal = () => {} } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: changePasswordServiceClient,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: () => {
          hideModal?.();
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const updatePassword = (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { newPassword, currentPassword, confirmPassword } = values;
    const body = {
      password: newPassword,
      currentPassword: currentPassword,
      passwordConfirmation: confirmPassword,
    };
    // console.log("updatepassword api called api call", body)
    mutate(body)
  };

  return (
    <CustomModal
      openModal={openModal}
      modalHeading={"Update password"}
      customWidthClass="md:w-[50%] sm:w-3/5 w-11/12"
    >
      <CustomFormikForm
        initialValues={initialValues}
        wantToUseFormikEvent={true}
        validationSchema={validationSchema}
        handleSubmit={updatePassword}
      >
        {({ values }: any) => (
          <Form>
            <div className="flex flex-col gap-4 ">
              <TextField
                type={"password"}
                name="currentPassword"
                label="Current password"
                placeholder="Enter current password"
                className="form-control1"
              />
              <TextField
                type={!showPassword ? "password" : "text"}
                name="newPassword"
                label="New password"
                placeholder="Enter new password"
                className="form-control1"
              />
              <ActionCheckbox
                checkboxLabel={"Show password"}
                checked={showPassword}
                onChange={() => setShowPassword((prev: boolean) => !prev)}
              />
              <TextField
                type="password"
                name="confirmPassword"
                label="Confirm password"
                placeholder="Enter confirm password"
              />
              {respError ? (
                <span className="text-center text-sm text-red-700">
                  {respError}
                </span>
              ) : null}
              <div className="flex justify-end items-center">
                <div className="flex justify-end items-center gap-4">
                  <ActionButton
                    text={"Cancel"}
                    onclick={hideModal}
                    customClass="btn btn-sm"
                    isActionButton={false}
                  />

                  <ActionButton
                    text={STRING_DATA.UPDATE}
                    isLoading={isPending}
                    isSubmit={true}
                    customClass="btn btn-sm h-full min-w-24"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </CustomFormikForm>
    </CustomModal>
  );
};

export default UpdatePasswordModal;
