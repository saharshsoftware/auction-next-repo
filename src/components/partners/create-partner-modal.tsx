"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import * as Yup from "yup";
import { Field, Form, FormikHelpers, FormikValues } from "formik";
import { useMutation } from "@tanstack/react-query";
import toast from "react-simple-toasts";
import {
  STRING_DATA,
  COOKIES,
} from "@/shared/Constants";
import { createPartnerClient } from "@/services/partners";
import { useUserData } from "@/hooks/useAuthenticated";
import { getCookie } from "cookies-next";
import { CONFIG } from "@/utilies/Config";
import { useRouter } from "next/navigation";
const GSTIN_REGEX = /^[A-Z0-9]{15}$/; // fallback: will uppercase on change

const validationSchema = Yup.object({
  name: Yup.string().trim().notRequired(),
  email: Yup.string()
    .transform((val) => (val === "" ? undefined : val))
    .email("Invalid email")
    .notRequired(),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^\d+$/, "Digits only")
    .min(10, "Must be 10 digits")
    .max(10, "Must be 10 digits"),
  addressLine1: Yup.string().notRequired(),
  addressLine2: Yup.string().notRequired(),
  city: Yup.string().notRequired(),
  state: Yup.string().notRequired(),
  pincode: Yup.string().notRequired(),
  GSTInfo: Yup.string()
    .transform((val) => (val ? String(val).toUpperCase() : val))
    .test("gst-valid", "Invalid GSTIN", (val) => {
      if (!val || val === "") return true;
      return GSTIN_REGEX.test(val as string);
    })
    .max(15),
  contactPerson: Yup.string().required("Contact person is required").min(2),
});

const initialValues = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  GSTInfo: "",
  contactPerson: "",
};

// Dummy values for development/testing (prefill=1)
const dummyValues = {
  addressLine1: "123 MG Road",
  addressLine2: "Near City Mall",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  GSTInfo: "27AABCU9603R1ZM",
  contactPerson: "Rajesh Kumar",
};

const CreatePartnerModal: React.FC<{ handleClose?: () => void }> = ({
  handleClose,
}) => {
  const router = useRouter();
  const [shouldPrefill, setShouldPrefill] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState(initialValues);
  const { userData } = useUserData();

  // Check for prefill parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const prefillParam = params.get("prefill");
      setShouldPrefill(prefillParam === "1");
    }
  }, []);

  // Prefill from user data if logged in (only email and phone)
  useEffect(() => {
    if (userData && !shouldPrefill) {
      setFormInitialValues((prev) => ({
        ...prev,
        email: userData.email || prev.email,
        phone: userData.username || prev.phone,
        contactPerson: userData.name || prev.contactPerson,
      }));
    }
  }, [userData, shouldPrefill]);

  // Populate form with dummy values when prefill is enabled
  useEffect(() => {
    if (shouldPrefill) {
      setFormInitialValues({
        ...dummyValues,
        name: userData?.name,
        contactPerson: userData?.name,
        email: userData?.email,
        phone: userData?.username,
      });
    }
  }, [shouldPrefill]);

  const resetFormRef = useRef<(() => void) | null>(null);
  
  const navigateToPartnerDashboard = useCallback(() => {
    const token = getCookie(COOKIES.TOKEN_KEY);
    window.open(`${CONFIG.PARTNER_DASHBOARD_URL}?auth_token=${token}`, '_blank', 'noopener,noreferrer');
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: createPartnerClient,
    onSuccess: () => {
      toast("Partner created successfully!", {
        duration: 4000,
        position: 'top-center',
        theme: 'success',
      });
      resetFormRef.current?.();
      router.push('/');
      navigateToPartnerDashboard();
    },
    onError: (err: any) => {
      console.log("[err createPartnerClient]", err);
      toast(err?.message || "Failed to create partner", {
        duration: 5000,
        position: 'top-center',
        theme: 'failure',
      });
    },
  });

  const mapPartnerFormToApi = (values: any) => {
    return {
      ...(values.name && {name: values.name}),
      ...(values.email && { email: values.email}),
      ...(values.phone && {phone: values.phone}),
      ...(values.contactPerson && {contactPerson: values.contactPerson}),
      ...(values.GSTInfo && {GSTInfo: values.GSTInfo}),
      ...(values.addressLine1 && {addressLine1: values.addressLine1}),
      ...(values.addressLine2 && {addressLine2: values.addressLine2}),
      ...(values.city && {city: values.city}),
      ...(values.state && {state: values.state}),
      ...(values.pincode && {pincode: values.pincode}),
    };
  };

  const handlePartnerSubmit = (values: any, helpers: FormikHelpers<FormikValues>) => {
    const payload = mapPartnerFormToApi(values);
    console.log("payload", payload);
    mutate({ formData: payload });
  };

  return (
    <div>
      <CustomFormikForm
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        handleSubmit={handlePartnerSubmit}
        enableReinitialize={true}
        wantToUseFormikEvent={true}
      >
        {({ values, setFieldValue, errors, touched, resetForm }: any) => {
          resetFormRef.current = resetForm;
          return (
            <Form>
              <div className="space-y-6">
                {/* User Information Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">User Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      name="email"
                      label="Email"
                      value={values.email}
                      placeholder="partner@example.com"
                      disabled={!!userData}
                    />
                    <TextField
                      name="phone"
                      label="Phone *"
                      value={values.phone}
                      placeholder="9876543210"
                      disabled={!!userData}
                    />
                    <TextField
                      name="contactPerson"
                      label="Contact Person *"
                      value={values.contactPerson}
                      placeholder="John Doe"
                      disabled={!!userData}
                    />
                  </div>
                </div>

                {/* Partner Information Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Partner Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      name="name"
                      label="Name"
                      value={values.name}
                      placeholder="Enter partner name"
                    />
                    <TextField name="GSTInfo" label="GSTIN" value={values.GSTInfo} placeholder="Enter GSTIN">
                      <Field name="GSTInfo">
                        {() => (
                          <input
                            maxLength={15}
                            value={values.GSTInfo}
                            onChange={(e: any) =>
                              setFieldValue("GSTInfo", String(e.target.value).toUpperCase())
                            }
                            className="w-full input input-bordered"
                            placeholder="Enter GSTIN"
                          />
                        )}
                      </Field>
                    </TextField>
                  </div>
                </div>

                {/* Address Information Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Address Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      name="addressLine1"
                      label="Address Line 1"
                      value={values.addressLine1}
                      placeholder="Building/House No., Street"
                    />
                    <TextField
                      name="addressLine2"
                      label="Address Line 2"
                      value={values.addressLine2}
                      placeholder="Locality, Landmark"
                    />
                    <TextField
                      name="city"
                      label="City"
                      value={values.city}
                      placeholder="Mumbai"
                    />
                    <TextField
                      name="state"
                      label="State"
                      value={values.state}
                      placeholder="Maharashtra"
                    />
                    <TextField
                      name="pincode"
                      label="Pincode"
                      value={values.pincode}
                      placeholder="400001"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t">
                  <ActionButton text={STRING_DATA.SUBMIT} isSubmit isLoading={isPending} />
                </div>
              </div>
            </Form>
          );
        }}
      </CustomFormikForm>
    </div>
  );
};

export default CreatePartnerModal;
