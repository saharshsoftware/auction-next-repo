"use client";
import React, { useEffect, useState } from "react";
import ActionButton from "../atoms/ActionButton";
import TextField from "../atoms/TextField";
import {
  ERROR_MESSAGE,
  getEmptyAllObject,
  REACT_QUERY,
  STRING_DATA,
  YEAR_OF_EXPERIENCE,
} from "@/shared/Constants";
import CustomFormikForm from "../atoms/CustomFormikForm";
import * as Yup from "yup";
import { Field, Form, FormikHelpers, FormikValues } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCityNamesCommaSeparated,
  sanitizeReactSelectOptions,
} from "@/shared/Utilies";
import { partnerConatctClient } from "@/services/contact";
import contactImage from "@/assets/images/contact.jpg";
import Image from "next/image";
import { fetchLocationClient } from "@/services/location";
import { ILocations } from "@/types";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";

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
  location: Yup.array().required(ERROR_MESSAGE.LOCATION_REQUIRED),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
  email: STRING_DATA.EMPTY,
  mobile: STRING_DATA.EMPTY,
  subject: STRING_DATA.EMPTY,
  message: STRING_DATA.EMPTY,
  location: STRING_DATA.EMPTY,
  background: STRING_DATA.EMPTY,
  experience: STRING_DATA.EMPTY,
  isActiveForAuction: STRING_DATA.EMPTY,
};

const PartnerForm = () => {
  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];
      const responseData = res ?? [];
      const updatedData = [...sanitizeReactSelectOptions(responseData)];
      return updatedData ?? [];
    },
  });

  const [citiesList, setCitiesList] = useState<ILocations[]>([]);
  const [respError, setRespError] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: partnerConatctClient,
    onSuccess: () => {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
    onError: (error: any) => {
      const { message } = error;
      setRespError(message);
    },
  });

  const handleContact = (values: any, helpers: FormikHelpers<FormikValues>) => {
    const { resetForm } = helpers;
    resetForm();
    const locations =
      values?.location?.length > 0
        ? getCityNamesCommaSeparated(values?.location as unknown as any[])
        : "";
    const payload = {
      cities: locations,
      email: values?.email,
      mobile: values?.mobile,
      name: values?.name,
      subject: values?.subject,
      reasonToJoin: values?.message,
      background: values?.background,
      experience: values?.experience?.value ? values?.experience?.value : "",
      isActiveForAuction: values?.isActiveForAuction === "Yes" ? true : false,
    };
    console.log("payload", payload);
    mutate({ formData: payload });
  };

  useEffect(() => {
    if (locationOptions) {
      const updatedData = locationOptions.filter(
        (item: ILocations) => item.type === "city"
      );
      setCitiesList(updatedData);
    }
  }, [locationOptions]);

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
                className="mx-auto -my-5"
                alt=""
              />
            </div>
            <div className="text-center space-y-3">
              <h2 className="custom-h2-class">Contact Us</h2>
              <p>Reach out to our broker support team</p>
              <a
                href="mailto:broker@eauctiondekho.com"
                className="text-blue-500 underline"
              >
                broker@eauctiondekho.com
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
              {({ values, setFieldValue, errors, touched }: any) => (
                <Form>
                  <div className="flex flex-col gap-4">
                    <TextField
                      value={values.name}
                      type="text"
                      name="name"
                      label="Name *"
                      placeholder="Enter name"
                    />
                    <TextField
                      value={values.mobile}
                      type="text"
                      name="mobile"
                      label="Mobile *"
                      placeholder="Enter mobile number"
                    />
                    <TextField
                      value={values.email}
                      type="text"
                      name="email"
                      label="Email *"
                      placeholder="Enter email"
                    />
                    <TextField
                      label={"City/Cities *  (Upto 5 cites) "}
                      name={"location"}
                      hasChildren={true}
                      value={values?.location}
                    >
                      <Field name="location">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={values?.location}
                            loading={isLoadingLocation}
                            options={citiesList}
                            placeholder="E.g., Jaipur, Jodhpur, Udaipur"
                            name="partner-location"
                            customClass="w-full"
                            isMulti={true}
                            hidePlaceholder={true}
                            onChange={(e) => {
                              setFieldValue(
                                "location",
                                e.label === STRING_DATA.ALL
                                  ? getEmptyAllObject()
                                  : e
                              );
                            }}
                          />
                        )}
                      </Field>
                    </TextField>

                    <TextField
                      value={values.background}
                      type="text"
                      name="background"
                      label="Profession/Background"
                      placeholder="E.g., Independent Broker, Real Estate Agent"
                    />

                    <TextField
                      label="Year Of Experience"
                      name="experience"
                      hasChildren={true}
                      value={values?.experience}
                    >
                      <Field name="experience">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={values?.experience}
                            options={YEAR_OF_EXPERIENCE}
                            placeholder="E.g., 0–1 year / 1–3 years / 3–5 years / 5+ years"
                            name="year-of-experience"
                            customClass="w-full"
                            hidePlaceholder={true}
                            onChange={(e) => {
                              setFieldValue(
                                "experience",
                                e.label === STRING_DATA.ALL
                                  ? getEmptyAllObject()
                                  : e
                              );
                            }}
                          />
                        )}
                      </Field>
                    </TextField>

                    <div>
                      <label className="block font-medium mb-1">
                        Are You Currently Active in Auction Deals?
                      </label>
                      <div className="flex gap-4">
                        {["Yes", "No"].map((option) => (
                          <label
                            key={option}
                            className={`flex items-center border px-4 py-2 rounded cursor-pointer ${
                              values.isActiveForAuction === option
                                ? "bg-blue-500 text-white"
                                : "border-blue-500 text-blue-500"
                            }`}
                          >
                            <input
                              type="radio"
                              name="isActiveForAuction"
                              value={option}
                              checked={values.isActiveForAuction === option}
                              onChange={() =>
                                setFieldValue("isActiveForAuction", option)
                              }
                              className="hidden"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                      {errors.isActiveForAuction &&
                        touched.isActiveForAuction && (
                          <div className="text-sm text-red-500 mt-1">
                            {errors.isActiveForAuction}
                          </div>
                        )}
                    </div>

                    <TextField
                      value={values.message}
                      type="textarea"
                      name="message"
                      label="Why do you want to join e-auctiondekho?"
                      placeholder="Enter message"
                    />

                    {respError && (
                      <span className="text-center text-sm text-red-700">
                        {respError}
                      </span>
                    )}
                    {showSuccessMessage && (
                      <span className="text-center text-sm text-green-700">
                        Thank you, will get back to you.
                      </span>
                    )}

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

export default PartnerForm;
