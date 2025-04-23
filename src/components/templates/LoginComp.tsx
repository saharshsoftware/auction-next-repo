"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { ERROR_MESSAGE, STRING_DATA } from "@/shared/Constants";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import { useMutation } from "@tanstack/react-query";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { redirect, useParams, useRouter } from "next/navigation";
import { handleOnSettled } from "@/shared/Utilies";
import { FormikValues } from "formik";
import { login } from "@/server/actions/auth";
import ActionCheckbox from "../atoms/ActionCheckbox";
import Link from "next/link";
// import { authenticate } from "@/app/lib/actions";
// import { signIn } from "@/auth";
import { signIn } from "next-auth/react";
import { loginClient } from "@/services/auth";

const validationSchema = Yup.object({
  email: Yup.string().trim().required(ERROR_MESSAGE.EMAIL_REQUIRED),
  password: Yup.string().trim().required(ERROR_MESSAGE.PASSWORD_REQUIRED),
});

const initialValues = {
  email: STRING_DATA.EMPTY,
  password: STRING_DATA.EMPTY,
};

export default function LoginComp(props: {
  isAuthModal?: boolean;
  handleLinkclick?: () => void;
  closeModal?: () => void;
}) {
  const {
    isAuthModal = false,
    handleLinkclick = () => {},
    closeModal = () => {},
  } = props;
  const router = useRouter();
  const params = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: loginClient,
    onSuccess(data, variables, context) {
      if (isAuthModal) {
        router.refresh();
        closeModal?.();
        return;
      }
      router.push(ROUTE_CONSTANTS.DASHBOARD);
      router.refresh();
    },
    onError(error: { message: string }) {
      const { message } = error;
      setRespError(message || "Something went wrong, please try again later");
    },
  });

  const handleLogin = async (values: FormikValues) => {
    const formData = {
      identifier: values.email,
      password: values.password,
    };
    // debugger;
    mutate({ formData });
    // const formData = new FormData(values);
    // await authenticate({identifier: "", password: ""});

    //  const response = await signIn("credentials", {
    //    email: "email",
    //    password: "password",
    //    redirect: false,
    //  });
    //  debugger
    //  console.log(response, "reponse")
  };
  return (
    <>
      <div className={`${isAuthModal ? "" : "common-auth-section-class"} my-4`}>
        <CustomFormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleSubmit={handleLogin}
        >
          <div className="flex flex-col gap-4 ">
            {!isAuthModal ? (
              <h2 className="custom-h2-class text-center text-3xl">
                {STRING_DATA.LOGIN}
              </h2>
            ) : null}
            <TextField
              type="text"
              name="email"
              label="Email"
              placeholder="Enter email"
            />
            <TextField
              type={!showPassword ? "password" : "text"}
              name="password"
              label="Password"
              placeholder="Enter password"
            />
            <ActionCheckbox
              checkboxLabel={"Show password"}
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            {respError ? (
              <span className="text-center text-sm text-red-700">
                {respError}
              </span>
            ) : null}
            <div className="flex justify-end items-center gap-4">
              {isAuthModal ? (
                <ActionButton
                  text={STRING_DATA.CANCEL.toUpperCase()}
                  onclick={closeModal}
                  isActionButton={false}
                />
              ) : null}
              <ActionButton
                text={STRING_DATA.LOGIN.toUpperCase()}
                isSubmit={true}
                customClass={`${isAuthModal ? null : "w-full"}`}
                isLoading={isPending}
              />
            </div>
            <p className="text-sm font-semibold flex">
              {STRING_DATA.NOT_REGISTERED} &nbsp;
              {isAuthModal ? (
                <div onClick={handleLinkclick} className="link link-primary">
                  {STRING_DATA.CREATE_ACCOUNT}
                </div>
              ) : (
                <Link
                  href={ROUTE_CONSTANTS.REGISTER}
                  className="link link-primary"
                >
                  {STRING_DATA.CREATE_ACCOUNT}
                </Link>
              )}
            </p>
            {!isAuthModal && (
              <>
                <div className="text-center text-sm font-medium text-gray-500">
                  -- OR --
                </div>
                <ActionButton
                  text="LOGIN WITH OTP"
                  onclick={() => router.push(ROUTE_CONSTANTS.LOGIN_OTP)}
                  isActionButton={false}
                  customClass="w-full"
                />
              </>
            )}
          </div>
        </CustomFormikForm>
      </div>
    </>
  );
}
