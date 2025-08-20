"use client";
import React, { useState } from "react";
import ActionButton from "../atoms/ActionButton";
import TextField from "../atoms/TextField";
import { ERROR_MESSAGE, STRING_DATA } from "@/shared/Constants";
import CustomFormikForm from "../atoms/CustomFormikForm";
import * as Yup from "yup";
import { Form, FormikHelpers, FormikValues } from "formik";
import { useMutation } from "@tanstack/react-query";
import { handleOnSettled } from "@/shared/Utilies";
import { ConatctUsClient } from "@/services/contact";
import contactImage from "@/assets/images/contact.jpg";
import Image from "next/image";

const validationSchema = Yup.object({
  name: Yup.string().trim().required(ERROR_MESSAGE.NAME_REQUIRED),
  email: Yup.string()
    .trim()
    .required(ERROR_MESSAGE.EMAIL_REQUIRED)
    .email(ERROR_MESSAGE.EMAIL_INVALID),
  mobile: Yup.number()
    .typeError("Must be a number")
    .required(ERROR_MESSAGE.MOBILE_REQUIRED)
    .positive("Must be a positive number")
    .integer("Must be an integer"),
  subject: Yup.string().trim().required(ERROR_MESSAGE.SUBJECT_REQUIRED),
  message: Yup.string().trim().required(ERROR_MESSAGE.MESSAGE_REQUIRED),
  auctionLink: Yup.string().trim().url("Please enter a valid URL").optional(),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
  email: STRING_DATA.EMPTY,
  mobile: STRING_DATA.EMPTY,
  subject: STRING_DATA.EMPTY,
  message: STRING_DATA.EMPTY,
  auctionLink: STRING_DATA.EMPTY,
};

const ContactForm = () => {
  const [respError, setRespError] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const { mutate, isPending } = useMutation({
    mutationFn: ConatctUsClient,
    onSettled: async (data) => {
      // console.log(data);
      const response = {
        data,
        success: () => {
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const handleContact = (
    values: {
      email: string;
      message: string;
      subject: string;
      mobile: string;
      name: string;
      auctionLink: string;
    },
    helpers: FormikHelpers<FormikValues>
  ) => {
    const { resetForm } = helpers;
    mutate({
      formData: values,
      onSettled: () => {
        resetForm();
      },
    });
  };
  return (
    <>
      <h2 className="text-4xl leading text-center ">
        Feel free to contact{" "}
        <hr className="border border-brand-color w-32 mx-auto my-4" />
      </h2>
      <div className="grid grid-cols-12 gap-2 md:w-11/12 w-full mx-auto">
        <div className="lg:col-span-6 col-span-full w-full">
          <div className="w-full my-12 mx-auto space-y-8 ">
            <div className="relative">
              <Image
                width={280}
                height={200}
                src={contactImage.src}
                className={"mx-auto -my-5"}
                alt={""}
              />
            </div>
            <div className="text-center space-y-3">
              <h2 className="custom-h2-class">Contact & Feedback</h2>
              <p className="text-sm-xs">Contact our support staff</p>
              <a
                href="mailto:contact@eauctiondekho.com"
                className="text-blue-500 underline text-sm-xs"
              >
                contact@eauctiondekho.com
              </a>
            </div>
            <div className="text-center space-y-3">
              <h2 className="custom-h2-class ">Sales</h2>
              <p className="text-sm-xs">For promotion and business </p>
              <a
                href="mailto:sales@eauctiondekho.com"
                className="text-blue-500 underline text-sm-xs"
              >
                sales@eauctiondekho.com
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-full">
          <div className="w-full my-12 mx-auto">
            <CustomFormikForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleSubmit={handleContact}
              enableReinitialize={true}
              wantToUseFormikEvent={true}
            >
              {({ values }: any) => (
                <Form>
                  <div className="flex flex-col gap-4 ">
                    <TextField
                      value={values?.name}
                      type="text"
                      name="name"
                      label="Name *"
                      placeholder="Enter name"
                    />

                    <TextField
                      value={values?.email}
                      type="text"
                      name="email"
                      label="Email *"
                      placeholder="Enter email"
                    />

                    <TextField
                      value={values?.mobile}
                      type="text"
                      name="mobile"
                      label="Mobile *"
                      placeholder="Enter mobile number"
                    />

                    <TextField
                      value={values?.subject}
                      type="text"
                      name="subject"
                      label="What is this regarding? *"
                      placeholder="Enter subject"
                    />

                    <TextField
                      value={values?.message}
                      type="textarea"
                      name="message"
                      label="Message *"
                      placeholder="Enter message"
                    />

                    <TextField
                      value={values?.auctionLink}
                      type="text"
                      name="auctionLink"
                      label="Auction Link (optional)"
                      placeholder="Enter auction link"
                    />
                    <p className="text-sm-xs text-gray-600 -mt-2">
                      If you want to enquire about a particular auction please provide the link
                    </p>

                    {respError ? (
                      <span className="text-center text-sm text-red-700">
                        {respError}
                      </span>
                    ) : null}
                    {showSuccessMessage ? (
                      <span className="text-center text-sm text-green-700">
                        Thank you, will get back to you.
                      </span>
                    ) : null}
                    <div className="flex justify-end items-center gap-4">
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
        </div>
      </div>
    </>
  );
};

export default ContactForm;
