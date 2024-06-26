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

const validationSchema = Yup.object({
  email: Yup.string().trim().required(ERROR_MESSAGE.EMAIL_REQUIRED),
  subject: Yup.string().trim().required(ERROR_MESSAGE.SUBJECT_REQUIRED),
  message: Yup.string().trim().required(ERROR_MESSAGE.MESSAGE_REQUIRED),
});

const initialValues = {
  email: STRING_DATA.EMPTY,
  subject: STRING_DATA.EMPTY,
  message: STRING_DATA.EMPTY,
};

const ContactForm = () => {
  const [respError, setRespError] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: ConatctUsClient,
    onSettled: async (data) => {
      // console.log(data);
      const response = {
        data,
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const handleContact = (
    values: { email: string; message: string; subject: string },
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
      <div className="md:w-[70%] w-full my-12 mx-auto">
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
                <h2 className="text-4xl leading ">Feel free to contact</h2>
                <TextField
                  value={values?.email}
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                />

                <TextField
                  value={values?.subject}
                  type="text"
                  name="subject"
                  label="Subject"
                  placeholder="Enter subject"
                />

                <TextField
                  value={values?.message}
                  type="textarea"
                  name="message"
                  label="Message"
                  placeholder="Enter message"
                />

                {respError ? (
                  <span className="text-center text-sm text-red-700">
                    {respError}
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
    </>
  );
};

export default ContactForm;
