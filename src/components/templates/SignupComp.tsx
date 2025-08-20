"use client";
import React, { useEffect, useState } from "react";
import TextField from "../../components/atoms/TextField";
import CustomFormikForm from "../../components/atoms/CustomFormikForm";
import ActionButton from "../../components/atoms/ActionButton";
import { ERROR_MESSAGE, getEmptyAllObject, REACT_QUERY, STRING_DATA } from "../../shared/Constants";
import * as Yup from "yup";
import ActionCheckbox from "../atoms/ActionCheckbox";
import { Field, Form, FormikValues } from "formik";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getCityNamesCommaSeparated, getCategoryNamesCommaSeparated, sanitizeReactSelectOptions, userTypeOptions } from "@/shared/Utilies";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ICategoryCollection, ILocations } from "@/types";
import { signupCustomClient } from "@/services/auth";
import OtpVerificationForm from "./OtpVerificationForm";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import UserTypeRadio from "../atoms/UserTypeRadio";
import { fetchLocationClient } from "@/services/location";
import { getCategoryBoxCollectionClient } from "@/services/auction";
import CustomModal from "../atoms/CustomModal";

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
  interestedCities: STRING_DATA.EMPTY,
  interestedCategories: STRING_DATA.EMPTY,
  userType: '',
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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [signupFormData, setSignupFormData] = useState<any>(null);
  
  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];
      const responseData = res ?? [];
      const updatedData = [...sanitizeReactSelectOptions(responseData)];
      return updatedData ?? [];
    },
  });

  const { data: categoryOptions, isLoading: isLoadingCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollectionClient()) as unknown as ICategoryCollection[];
      const updatedData = [...sanitizeReactSelectOptions(res)];
      return updatedData ?? [];
    },
  });

  const [citiesList, setCitiesList] = useState<ILocations[]>(locationOptions ?? []);

  useEffect(() => {
    if (locationOptions) {
      const updatedData = locationOptions.filter(
        (item: ILocations) => item.type === "city"
      );
      setCitiesList(updatedData);
    }
  }, [locationOptions]);

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
      // Close the profile modal when there's an error
      setShowProfileModal(false);
      setSignupFormData(null);
    },
  });

  const handleRegister = async (values: FormikValues) => {
    setFormValues(values); // Save the form values
    setSignupFormData(values);
    setShowProfileModal(true);
  };

  const handleProfileSubmit = (profileValues: any) => {
    const locations =
      profileValues?.interestedCities?.length > 0
        ? getCityNamesCommaSeparated(profileValues?.interestedCities as unknown as any[])
        : "";
    const categories =
      profileValues?.interestedCategories?.length > 0
        ? getCategoryNamesCommaSeparated(profileValues?.interestedCategories as unknown as any[])
        : "";

    const userType = profileValues.userType.value;
    const formData = {
      username: signupFormData.phoneNumber,
      email: signupFormData.email,
      password: signupFormData.password,
      name: signupFormData.name,
      interestedCities: locations,
      interestedCategories: categories,
      userType: userType,
    };
    console.log(formData, "formdata");
    setShowProfileModal(false);
    mutate({ formData });
  };

  const handleRegisterCallback = () => {
    setOtpVerification(false);
    setRespError("");
  };

  // Reset modal state when there's an error
  useEffect(() => {
    if (respError) {
      setShowProfileModal(false);
      setSignupFormData(null);
    }
  }, [respError]);

  // Cleanup modal state on unmount
  useEffect(() => {
    return () => {
      setShowProfileModal(false);
      setSignupFormData(null);
    };
  }, []);

  const ProfileModal = () => (
    <CustomModal
      openModal={showProfileModal}
      modalHeading="Complete Your Profile"
      customWidthClass="md:w-[50%] sm:w-3/5 w-11/12"
      onClose={() => {
        setShowProfileModal(false);
        setSignupFormData(null);
      }}
      isCrossVisible={true}
    >
      <CustomFormikForm
        initialValues={{
          interestedCities: [],
          interestedCategories: [],
          userType: '',
        }}
        wantToUseFormikEvent={true}
        handleSubmit={handleProfileSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }: any) => (
          <Form className="w-full">
            <div className="flex flex-col gap-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  {STRING_DATA.HELPS_US_PERSONALIZE_RECOMMENDATIONS_FOR_YOU} (optional)
                </h3>
                <p className="text-sm text-gray-600">
                  This information helps us personalize your experience. You can skip this step.
                </p>
              </div>
              
              <TextField
                label={"Interested Cities (Upto 5 cities)"}
                name={"interestedCities"}
                hasChildren={true}
                value={values?.interestedCities}
              >
                <Field name="interestedCities">
                  {() => (
                    <ReactSelectDropdown
                      defaultValue={values?.interestedCities}
                      loading={isLoadingLocation}
                      options={citiesList}
                      placeholder="E.g., Jaipur, Jodhpur, Udaipur"
                      name="signup-interested-cities"
                      customClass="w-full"
                      isMulti={true}
                      hidePlaceholder={true}
                      onChange={(e) => {
                        setFieldValue("interestedCities", e);
                      }}
                    />
                  )}
                </Field>
              </TextField>
              
              <TextField
                label={STRING_DATA.INTERESTED_CATEGORIES}
                name={"interestedCategories"}
                hasChildren={true}
                value={values?.interestedCategories}
              >
                <Field name="interestedCategories">
                  {() => (
                    <ReactSelectDropdown
                      defaultValue={values?.interestedCategories}
                      loading={isLoadingCategory}
                      options={categoryOptions}
                      placeholder="E.g., Residential, Commercial, Industrial"
                      name="signup-interested-categories"
                      customClass="w-full"
                      isMulti={true}
                      hidePlaceholder={true}
                      onChange={(e) => {
                        setFieldValue("interestedCategories", e);
                      }}
                    />
                  )}
                </Field>
              </TextField>

              <TextField
                label="Who are you?"
                name={"userType"}
                hasChildren={true}
                value={values?.userType}
              >
                <Field name="userType">
                  {() => (
                    <UserTypeRadio value={values?.userType} onChange={(e) => setFieldValue("userType", e)} />
                  )}
                </Field>
              </TextField>

              <div className="flex justify-end items-center pt-4">
                <ActionButton
                  text="Create Account"
                  isSubmit={true}
                  customClass="btn btn-sm"
                />
              </div>
            </div>
          </Form>
        )}
      </CustomFormikForm>
    </CustomModal>
  );

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
                          <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none text-sm-xs">
                            + 91
                          </div>
                          <input
                            type="text"
                            value={values.phoneNumber}
                            name={"phoneNumber"}
                            className="bg-gray-50 border border-brand-color text-gray-900 sm:text-sm hover:bg-gray-100 block w-full p-2 ps-12 rounded text-sm-xs"
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
                    customClass="form-controls"
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
                      id={`create-account-btn`}
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
      <ProfileModal />
    </>
  );
}
