"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { ERROR_MESSAGE, STRING_DATA } from "@/shared/Constants";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import { useMutation } from "@tanstack/react-query";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { redirect, useRouter } from "next/navigation";
import { handleOnSettled } from "@/shared/Utilies";
import { FormikValues } from "formik";
import { login } from "@/server/actions/auth";
import ActionCheckbox from "../atoms/ActionCheckbox";
import Link from "next/link";
// import { authenticate } from "@/app/lib/actions";
// import { signIn } from "@/auth";
import { signIn } from "next-auth/react";

const validationSchema = Yup.object({
  email: Yup.string().trim().required(ERROR_MESSAGE.EMAIL_REQUIRED),
  password: Yup.string().trim().required(ERROR_MESSAGE.PASSWORD_REQUIRED),
});

const initialValues = {
  email: STRING_DATA.EMPTY,
  password: STRING_DATA.EMPTY,
};

export default function LoginComp() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: () => {
          router.push(ROUTE_CONSTANTS.DASHBOARD);
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
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
      <div className="common-auth-section-class my-4">
        <CustomFormikForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleSubmit={handleLogin}
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
            <div className="flex justify-center items-center gap-4">
              <ActionButton
                text={STRING_DATA.LOGIN.toUpperCase()}
                isSubmit={true}
                customClass="w-full"
                isLoading={isPending}
              />
            </div>
            <p className="text-sm font-semibold">
              { STRING_DATA.NOT_REGISTERED } &nbsp;
              <Link  href={ROUTE_CONSTANTS.REGISTER} className="link link-primary">
                { STRING_DATA.CREATE_ACCOUNT }
              </Link>
            </p>
          </div>
        </CustomFormikForm>
      </div>
    </>
  );
}
