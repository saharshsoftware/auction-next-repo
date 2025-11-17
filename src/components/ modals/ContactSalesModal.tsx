"use client";
import React, { useState, useEffect, useRef } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import * as Yup from "yup";
import { Form, FormikHelpers, FormikValues, FormikProps } from "formik";
import { useMutation } from "@tanstack/react-query";
import { partnerConatctClient } from "@/services/contact";
import { ERROR_MESSAGE, STRING_DATA } from "@/shared/Constants";
import { UserProfileApiResponse } from "@/interfaces/UserProfileApi";

interface IContactSalesModal {
  openModal: boolean;
  hideModal: () => void;
  initialPhoneNumber?: string;
  userData?: UserProfileApiResponse;
}

const validationSchema = Yup.object({
  mobile: Yup.string()
    .trim()
    .required(ERROR_MESSAGE.MOBILE_REQUIRED)
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

const ContactSalesModal: React.FC<IContactSalesModal> = ({
  openModal,
  hideModal,
  initialPhoneNumber = "",
  userData,
}) => {
  const [respError, setRespError] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: partnerConatctClient,
    onSuccess: () => {
      setShowSuccessMessage(true);
      setRespError("");
      setTimeout(() => {
        setShowSuccessMessage(false);
        hideModal();
      }, 2000);
    },
    onError: (error: any) => {
      const { message } = error;
      setRespError(message || "Something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    if (openModal && formikRef.current) {
      formikRef.current.setFieldValue("mobile", initialPhoneNumber);
      setRespError("");
      setShowSuccessMessage(false);
    } else if (!openModal && formikRef.current) {
      formikRef.current.resetForm();
      setRespError("");
      setShowSuccessMessage(false);
    }
  }, [openModal, initialPhoneNumber]);

  const handleSubmit = (
    values: FormikValues,
    helpers: FormikHelpers<FormikValues>
  ) => {
    setRespError("");
    setShowSuccessMessage(false);
    const payload = {
      name: userData?.name || "",
      email: userData?.email || "",
      mobile: values.mobile,
      cities: userData?.interestedCities || "",
      reasonToJoin: "i want to subscribe to broker plus subscription",
      isActiveForAuction: false,
    };
    mutate({ formData: payload });
  };

  return (
    <CustomModal
      openModal={openModal}
      modalHeading="Contact Sales"
      customWidthClass="md:w-[32%] sm:w-3/5 w-11/12"
      isCrossVisible={true}
      onClose={hideModal}
    >
      <div className="flex flex-col gap-4 w-full">
        <p className="text-left text-gray-700 text-sm">
          Please provide your phone number and we&apos;ll get back to you soon.
        </p>
        <CustomFormikForm
          initialValues={{ mobile: initialPhoneNumber }}
          validationSchema={validationSchema}
          handleSubmit={handleSubmit}
          enableReinitialize={true}
          wantToUseFormikEvent={true}
          formikRef={formikRef}
        >
          {({ values }: FormikValues) => (
            <Form>
              <div className="flex flex-col gap-4">
                <TextField
                  value={values.mobile}
                  type="text"
                  name="mobile"
                  label="Phone Number *"
                  placeholder="Enter 10-digit phone number"
                />
                {respError && (
                  <span className="text-center text-sm text-red-700">
                    {respError}
                  </span>
                )}
                {showSuccessMessage && (
                  <span className="text-center text-sm text-green-700">
                    Thank you! We&apos;ll get back to you soon.
                  </span>
                )}
                <div className="flex justify-end items-center gap-4">
                  <ActionButton
                    text="Cancel"
                    onclick={hideModal}
                    customClass="btn btn-sm bg-gray-500 hover:bg-gray-600"
                    isActionButton={true}
                  />
                  <ActionButton
                    text={STRING_DATA.SUBMIT.toUpperCase()}
                    isSubmit={true}
                    isLoading={isPending}
                  />
                </div>
              </div>
            </Form>
          )}
        </CustomFormikForm>
      </div>
    </CustomModal>
  );
};

export default ContactSalesModal;

