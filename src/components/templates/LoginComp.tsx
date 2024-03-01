"use client";
import React from "react";
import * as Yup from "yup";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { ERROR_MESSAGE, STRING_DATA } from "@/shared/Constants";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";

const validationSchema = Yup.object({
  email: Yup.string().trim().required(ERROR_MESSAGE.EMAIL_REQUIRED),
  password: Yup.string().trim().required(ERROR_MESSAGE.PASSWORD_REQUIRED),
});

const initialValues = {
  email: STRING_DATA.EMPTY,
  password: STRING_DATA.EMPTY,
};

export default function LoginComp() {
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
              {STRING_DATA.LOGIN}
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
                text={STRING_DATA.LOGIN.toUpperCase()}
                isSubmit={true}
              />
            </div>
          </div>
        </CustomFormikForm>
      </div>
    </>
  );
}
