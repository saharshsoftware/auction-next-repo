"use client";
import React from "react";
import TextField from "../../components/atoms/TextField";
import CustomFormikForm from "../../components/atoms/CustomFormikForm";
import ActionButton from "../../components/atoms/ActionButton";
import { ERROR_MESSAGE, STRING_DATA } from "../../shared/Constants";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().trim().required(ERROR_MESSAGE.EMAIL_REQUIRED),
  password: Yup.string().trim().required(ERROR_MESSAGE.PASSWORD_REQUIRED),
});

const initialValues = {
  email: STRING_DATA.EMPTY,
  password: STRING_DATA.EMPTY,
};

export default function SignupComp() {
  const handleRegister = (values: any) => {
    console.log(values);
  };
  return (
    <>
      <div className="common-auth-section-class ">
        <CustomFormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleSubmit={handleRegister}
        >
          <div className="flex flex-col gap-4 ">
            <h2 className="custom-h2-class text-center text-3xl">
              {STRING_DATA.REGISTER}
            </h2>
            <TextField
              type="text"
              name="email"
              label="Email"
              placeholder="Enter email"
            />
            <TextField
              type="text"
              name="password"
              label="Password"
              placeholder="Enter password"
            />
            <div className="flex justify-center items-center gap-4">
              <ActionButton
                text={STRING_DATA.CREATE_ACCOUNT.toUpperCase()}
                isSubmit={true}
                // isLoading={true}
              />
            </div>
          </div>
        </CustomFormikForm>
      </div>
    </>
  );
}
