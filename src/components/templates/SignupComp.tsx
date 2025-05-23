"use client";
import React, { useState } from "react";
import TextField from "../../components/atoms/TextField";
import CustomFormikForm from "../../components/atoms/CustomFormikForm";
import ActionButton from "../../components/atoms/ActionButton";
import { ERROR_MESSAGE, STRING_DATA } from "../../shared/Constants";
import * as Yup from "yup";
import ActionCheckbox from "../atoms/ActionCheckbox";
import { Field, Form, FormikValues } from "formik";

import { signup } from "@/server/actions";
import { useMutation } from "@tanstack/react-query";
import { handleOnSettled } from "@/shared/Utilies";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IUserData } from "@/types";
import { signupClient, signupCustomClient } from "@/services/auth";
import OtpVerificationForm from "./OtpVerificationForm";

const validationSchema = Yup.object({
  name: Yup.string().trim().required(ERROR_MESSAGE.NAME_REQUIRED),
  email: Yup.string().email(ERROR_MESSAGE.VALID_EMAIL).required(ERROR_MESSAGE.EMAIL_REQUIRED),
  phoneNumber: Yup.string()
    .trim()
    .required(ERROR_MESSAGE.PHONE_REQUIRED)
    .min(10, ERROR_MESSAGE.MIN_PHONE_LENGTH)
    .max(10, ERROR_MESSAGE.MAX_PHONE_LENGTH)
    .matches(/^[0-9]+$/, ERROR_MESSAGE.PHONE_NUMERIC), // Add pattern validation
  password: Yup.string()
    .trim()
    .min(6, ERROR_MESSAGE.MIN_6)
    .max(30, ERROR_MESSAGE.MAX_PASS_30)
    .required(ERROR_MESSAGE.PASSWORD_REQUIRED),
  confirmPassword: Yup.string()
    .trim()
    .required(ERROR_MESSAGE.CONFIRM_PASSWORD)
    .oneOf([Yup.ref("password")], ERROR_MESSAGE.PASSWORDS_MUST_MATCH),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
  email: STRING_DATA.EMPTY,
  password: STRING_DATA.EMPTY,
  phoneNumber: STRING_DATA.EMPTY,
};

export default function SignupComp(props: {
  isAuthModal?: boolean;
  handleLinkclick?: () => void;
  closeModal?: () => void;
}) {
  const {
    isAuthModal = false,
    handleLinkclick = () => { },
    closeModal = () => { },
  } = props;
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormikValues>(initialValues);

  const [showPassword, setShowPassword] = useState(false);
  const [respError, setRespError] = useState<string>("");
  const [otpVerification, setOtpVerification] = useState(false);
  const [email, setEmail] = useState("");

  // Mutations
  // const { mutate, isPending, error } = useMutation({
  //   mutationFn: signupClient,
  //   onSettled: async (data) => {
  //     console.log(data);
  //     const response = {
  //       data,
  //       success: (data: IUserData) => {
  //         // console.log(data);
  //         if (isAuthModal) {
  //           closeModal?.();
  //           return;
  //         }
  //         router.push(ROUTE_CONSTANTS.DASHBOARD);
  //       },
  //       fail: (error: any) => {
  // const { message } = error;
  // setRespError(message);
  //       },
  //     };
  //     handleOnSettled(response);
  //   },
  //   onError: (error) => {
  //     console.log(error, "error");
  //   },
  // });

  const { mutate, isPending } = useMutation({
    mutationFn: signupCustomClient,

    onSuccess(data, variables, context) {
      console.log(variables, "variables");
      const requestEmail = variables.formData.email;
      setOtpVerification(true);
      setEmail(requestEmail);
      // router.push(ROUTE_CONSTANTS.DASHBOARD);
    },
    onError: (error) => {
      const { message } = error;
      setRespError(message);
    },
  });

  const handleRegister = async (values: FormikValues) => {
    setFormValues(values); // Save the form values
    const formData = {
      username: values.phoneNumber,
      email: values.email,
      password: values.password,
      name: values.name,
    };
    console.log(formData, "formdata");
    mutate({ formData });
  };

  const handleRegisterCallback = () => {
    setOtpVerification(false);
    setRespError("");
  };
  return (
    <>
      {!otpVerification ? (
        <div
          className={`${isAuthModal ? "" : "common-auth-section-class"} my-4`}
        >
          <CustomFormikForm
            initialValues={formValues}
            validationSchema={validationSchema}
            handleSubmit={handleRegister}
            wantToUseFormikEvent={true}
            enableReinitialize={true}
          >
            {({ setFieldValue, values }: any) => (
              <Form>
                <div className="flex flex-col gap-4 ">
                  {!isAuthModal ? (
                    <h2 className="custom-h2-class text-center text-3xl">
                      {STRING_DATA.REGISTER}
                    </h2>
                  ) : null}
                  <TextField
                    value={values.name}
                    type="text"
                    name="name"
                    label="Name"
                    placeholder="Enter name"
                  />
                  <TextField
                    value={values.email}
                    type="text"
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                  />
                  <TextField
                    label={"Phone Number"}
                    name={"phoneNumber"}
                    hasChildren={true}
                  >
                    <Field name="phoneNumber">
                      {() => (
                        <div className="relative w-full">
                          <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none text-base sm:text-sm">
                            + 91
                          </div>
                          <input
                            type="text"
                            value={values.phoneNumber}
                            name={"phoneNumber"}
                            className="bg-gray-50 border border-brand-color text-gray-900 sm:text-sm hover:bg-gray-100 block w-full p-2 ps-12 rounded"
                            autoComplete="false"
                            placeholder="Enter phone number"
                            onChange={(e) => {
                              setFieldValue("phoneNumber", e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </TextField>
                  <TextField
                    value={values.password}
                    type={!showPassword ? "password" : "text"}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    className="form-control1"
                  />
                  <ActionCheckbox
                    checkboxLabel={"Show password"}
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                  />
                  <TextField
                    value={values.confirmPassword}
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
                  <div className="flex justify-end items-center gap-4 ">
                    {isAuthModal ? (
                      <ActionButton
                        text={STRING_DATA.CANCEL.toUpperCase()}
                        onclick={closeModal}
                        isActionButton={false}
                      />
                    ) : null}
                    <ActionButton
                      text={STRING_DATA.CREATE_ACCOUNT.toUpperCase()}
                      isSubmit={true}
                      isLoading={isPending}
                      customClass={`${isAuthModal ? null : "w-full"}`}
                    />
                  </div>
                  <p className="text-sm font-semibold flex">
                    {STRING_DATA.ALREADY_HAVE_ACCOUNT} &nbsp;
                    {isAuthModal ? (
                      <div
                        onClick={handleLinkclick}
                        className="link link-primary"
                      >
                        {STRING_DATA.LOGIN}
                      </div>
                    ) : (
                      <Link
                        href={ROUTE_CONSTANTS.LOGIN}
                        className="link link-primary"
                      >
                        {STRING_DATA.LOGIN}
                      </Link>
                    )}
                  </p>
                </div>
              </Form>
            )}
          </CustomFormikForm>
        </div>
      ) : (
        <OtpVerificationForm
          email={email}
          isRegisteredRoute={true}
          isAuthModal={isAuthModal}
          registerFormCallback={handleRegisterCallback}
        />
      )}
    </>
  );
}
