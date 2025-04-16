"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import { ERROR_MESSAGE } from "@/shared/Constants";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { Form, Formik, FormikValues } from "formik";
import { useMutation } from "@tanstack/react-query";
import { sendSignInOtpClient, siginUsingOtpClient } from "@/services/auth";
import OTPInput from "../atoms/OTPInput";
import toast from "react-simple-toasts";

const getValidationSchema = (isOtpSent: boolean) => {
  return Yup.object({
    email: Yup.string()
      .trim()
      .email(ERROR_MESSAGE.EMAIL_INVALID)
      .required(ERROR_MESSAGE.EMAIL_REQUIRED),
    otp: isOtpSent
      ? Yup.string()
          .trim()
          .length(4, "OTP must be 4 digits")
          .required("OTP is required")
      : Yup.string().notRequired(),
  });
};

interface OtpVerificationFormProps {
  email?: string;
  isRegisteredRoute?: boolean;
  registerFormCallback?: () => void;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email = "",
  isRegisteredRoute = false,
  registerFormCallback = () => {},
}) => {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [otpValue, setOtpValue] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [respError, setRespError] = useState<string>("");

  const handleEditEmail = () => {
    if (isRegisteredRoute) {
      registerFormCallback();
      return;
    }
    setIsOtpSent(false);
    setOtpValue("");
  };

  useEffect(() => {
    if (email) {
      setSubmittedEmail(email);
    }
    if (isRegisteredRoute) {
      setIsOtpSent(true);
    }
  }, [email, isRegisteredRoute]);

  const { mutate, isPending } = useMutation({
    mutationFn: sendSignInOtpClient,
    onSuccess: (data, variables) => {
      setRespError("");
      setIsOtpSent(true);
      setSubmittedEmail(variables.email);
      setTimer(300);
      toast(data?.message, {
        theme: "success",
        position: "top-center",
      });
    },
    onError: (error) => {
      const { message } = error;
      setRespError(message);
    },
  });

  const {
    mutate: mutateSiginUsingOtpClient,
    isPending: isPendingSiginUsingOtpClient,
  } = useMutation({
    mutationFn: siginUsingOtpClient,
    onSuccess: (data, variables) => {
      setRespError("");
      console.log("OTP sent successfully", data);
      router.push(ROUTE_CONSTANTS.DASHBOARD);
    },
    onError: (error) => {
      console.log("Error sending OTP", error);
      const { message } = error;
      setRespError(message || "Invalid OTP");
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = (values: FormikValues) => {
    if (!isOtpSent) {
      mutate({ email: values.email });
    } else {
      mutateSiginUsingOtpClient({
        email: values.email,
        otp: otpValue,
      });
      // Add your OTP verification logic here
    }
  };

  return (
    <div className="common-auth-section-class">
      <Formik
        initialValues={{
          email: submittedEmail,
          otp: "",
        }}
        validationSchema={getValidationSchema(isOtpSent)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <div className="flex flex-col gap-4">
              <h2 className="custom-h2-class text-center text-3xl">
                {isOtpSent ? "OTP verification" : "Login with OTP"}
              </h2>
              {!isOtpSent ? (
                <TextField
                  type="text"
                  value={values?.email}
                  name="email"
                  label="Email"
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">
                    We&apos;ve sent a 4-digit OTP to{" "}
                    <span className="font-semibold">{submittedEmail}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleEditEmail}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1 underline focus:outline-none"
                  >
                    Change
                  </button>
                </div>
              )}
              {isOtpSent && (
                <div className="flex flex-col gap-2">
                  <OTPInput
                    length={4}
                    onChange={(value) => {
                      setOtpValue(value);
                      setFieldValue("otp", value);
                    }}
                    disabled={false}
                    value={otpValue}
                  />
                </div>
              )}
              {respError ? (
                <span className="text-center text-sm text-red-700">
                  {respError}
                </span>
              ) : null}
              <div className="flex justify-between items-center gap-4">
                <ActionButton
                  text={isOtpSent ? "VERIFY OTP" : "SEND OTP"}
                  isSubmit={true}
                  isLoading={
                    (!isOtpSent && isPending) || isPendingSiginUsingOtpClient
                  }
                  customClass="w-full"
                  disabled={isOtpSent && values.otp.length < 4}
                />
              </div>

              {isOtpSent && (
                <div className="flex justify-between items-center text-sm text-center">
                  <div className="text-sm text-center text-gray-500">
                    OTP expires in:{" "}
                    <span className="font-medium">{formatTime(timer)}</span>
                  </div>
                  <span
                    className="text-blue-600 cursor-pointer underline"
                    onClick={() => {
                      if (submittedEmail) {
                        mutate({ email: submittedEmail });
                        setTimer(300);
                      }
                    }}
                  >
                    Resend OTP
                  </span>
                </div>
              )}

              {!isOtpSent && (
                <>
                  <div className="text-center text-sm font-medium text-gray-500">
                    -- OR --
                  </div>
                  <ActionButton
                    text="LOGIN USING EMAIL AND PASSWORD"
                    onclick={() => router.push(ROUTE_CONSTANTS.LOGIN)}
                    isActionButton={false}
                    customClass="w-full"
                  />
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OtpVerificationForm;
