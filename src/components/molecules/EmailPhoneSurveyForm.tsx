import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import { STRING_DATA } from "@/shared/Constants";

const validationSchema = Yup.object()
  .shape({
    email: Yup.string().email("Invalid email format"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .nullable(),
  })
  .test(
    "at-least-one",
    "Either email or phone number is required",
    (values) => {
      return !!values.email || !!values.phone; // Ensures at least one is filled
    }
  );

const EmailPhoneSurveyForm = (props: {
  hideModalFn?: () => void;
  handleSubmit: (email: string, phone: string) => void;
}) => {
  const { handleSubmit } = props;

  const handleFormSubmit = (values: any) => {
    console.log("Form Submitted", values);

    handleSubmit(values.email, values.phone);
  };
  return (
    <Formik
      initialValues={{ email: "", phone: "" }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ isValid, values }) => (
        <Form className="p-6">
          <div className="my-4">
            <TextField
              type="text"
              name="email"
              label="Email address:"
              placeholder="Enter email"
            />
          </div>
          <div className="my-4">
            <TextField
              type="text"
              name="phone"
              label="Phone number:"
              placeholder="Enter phone number"
            />
          </div>
          <p className="text-sm text-gray-500">
            * At least one contact method (email or phone) is required{" "}
          </p>
          <div className="flex justify-end mt-4">
            <ActionButton
              text={STRING_DATA.SUBMIT.toUpperCase()}
              isSubmit={true}
              isLoading={false}
              disabled={
                (values?.email === "" && values?.phone === "") || !isValid
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmailPhoneSurveyForm;
