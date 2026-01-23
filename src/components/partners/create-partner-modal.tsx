"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import ActionCheckboxV2 from "../atoms/ActionCheckboxV2";
import AllowedPincodes from "../atoms/AllowedPincodes";
import * as Yup from "yup";
import { Field, Form, FormikHelpers, FormikValues } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-simple-toasts";
import {
  STRING_DATA,
  AVAILABLE_SERVICES,
  COOKIES,
} from "@/shared/Constants";
import { sanitizeReactSelectOptions } from "@/shared/Utilies";
import { fetchLocationClient } from "@/services/location";
import { getCollectionDataClient } from "@/services/auction";
import { API_ENPOINTS } from "@/services/api";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import { createPartnerClient } from "@/services/partners";
import { useUserData } from "@/hooks/useAuthenticated";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { CONFIG } from "@/utilies/Config";
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
  allowedCities: Yup.array().min(1, "Select at least 1 city").required(),
  allowedCategories: Yup.array().min(1, "Select at least 1 category").required(),
  allowedPincodes: Yup.array().of(Yup.string().matches(/^\d{6}$/, "Invalid pincode`")),
  supportedServices: Yup.array().min(1, "Select at least 1 service").required(),
  isActive: Yup.boolean().required(),
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
  allowedCities: [] as any[],
  allowedCategories: [] as any[],
  allowedPincodes: [] as string[],
  supportedServices: ['property_interest', 'auction_support', 'documentation', 'due_diligence'] as string[],
  isActive: true,
};

// Dummy values for development/testing (prefill=1)
const dummyValues = {
  name: "ABC Electronics Trading Co.",
  email: "contact@abcelectronics.com",
  phone: "9876543210",
  addressLine1: "123 MG Road",
  addressLine2: "Near City Mall",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  GSTInfo: "27AABCU9603R1ZM",
  contactPerson: "Rajesh Kumar",
  allowedCities: ['mumbai'] as any[], // Will be populated from API
  allowedCategories: ['property'] as any[], // Will be populated from API
  allowedPincodes: ["400001", "400002", "400003"],
  supportedServices: ['property_interest', 'auction_support', 'documentation', 'due_diligence'] as string[], // Using common service IDs
  isActive: true,
};

const CreatePartnerModal: React.FC<{ handleClose?: () => void }> = ({
  handleClose,
}) => {
  const [shouldPrefill, setShouldPrefill] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState(initialValues);
  const router = useRouter();
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
      }));
    }
  }, [userData, shouldPrefill]);

  const { data: locationOptions = [], isLoading: loadingLocations } = useQuery({
    queryKey: ["PARTNER_LOCATIONS"],
    queryFn: async () => {
      const res = await fetchLocationClient();
      return sanitizeReactSelectOptions(res ?? []);
    },
  });

  const { data: categoryOptions = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["PARTNER_CATEGORIES"],
    queryFn: async () => {
      const res = await getCollectionDataClient({
        endpoints: API_ENPOINTS.CATEGORY_BOX_COLLETIONS,
      });
      return sanitizeReactSelectOptions(res ?? []);
    },
  });

  // Populate form with dummy values when prefill is enabled and options are loaded
  useEffect(() => {
    if (shouldPrefill && locationOptions.length > 0 && categoryOptions.length > 0) {
      setFormInitialValues({
        ...dummyValues,
        allowedCities: locationOptions.slice(0, 2), // Select first 2 cities
        allowedCategories: categoryOptions.slice(0, 2), // Select first 2 categories
      });
    }
  }, [shouldPrefill, locationOptions, categoryOptions]);

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

  // Identifier mode for allowedCities / allowedCategories: 'id' | 'slug' | 'name'
  // Default uses IDs. Can be overridden via NEXT_PUBLIC_PARTNER_IDENTIFIER env var ('id'|'slug'|'name').
  const PARTNER_ALLOWED_IDENTIFIER = 'name';

  const pickIdentifier = (item: any, identifier: string) => {
    if (!item) return String(item ?? "");
    if (identifier === "id") return item?.value ?? item?.id ?? item?.Id ?? item?.ID ?? String(item);
    if (identifier === "slug") return item?.slug ?? item?.value ?? item?.id ?? item?.label ?? String(item);
    if (identifier === "name") return item?.name ?? item?.label ?? item?.value ?? String(item);
    return item?.value ?? item?.id ?? item?.label ?? String(item);
  };

  const mapPartnerFormToApi = (values: any) => {
    const allowedCities = (values.allowedCities || []).map((c: any) =>
      pickIdentifier(c, PARTNER_ALLOWED_IDENTIFIER)
    );
    const allowedCategories = (values.allowedCategories || []).map((c: any) =>
      pickIdentifier(c, PARTNER_ALLOWED_IDENTIFIER)
    );

    return {
      name: values.name || "",
      email: values.email || "",
      phone: values.phone || "",
      contactPerson: values.contactPerson || "",
      status: values.status || "active",
      allowedCities,
      allowedPincodes: values.allowedPincodes || [],
      allowedCategories,
      supportedServices: values.supportedServices || [],
      GSTInfo: values.GSTInfo || "",
      addressLine1: values.addressLine1 || "",
      addressLine2: values.addressLine2 || "",
      city: values.city || "",
      state: values.state || "",
      pincode: values.pincode || null,
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
                {/* Basic Information Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      name="name"
                      label="Name"
                      value={values.name}
                      placeholder="Enter partner name"
                    />
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
                    />

                    {/* Active Partner Checkbox */}
                    <div>
                      <ActionCheckboxV2
                        checkboxLabel="Active Partner"
                        id="isActive"
                        name="isActive"
                        checked={values.isActive ?? false}
                        onChange={() => setFieldValue("isActive", !values.isActive)}
                      />
                      {touched.isActive && errors.isActive && (
                        <div className="text-xs text-red-500 mt-1">{errors.isActive}</div>
                      )}
                    </div>
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
                    <TextField name="GSTInfo" label="GSTIN" value={values.GSTInfo}>
                      <Field name="GSTInfo">
                        {() => (
                          <input
                            maxLength={15}
                            value={values.GSTInfo}
                            onChange={(e: any) =>
                              setFieldValue("GSTInfo", String(e.target.value).toUpperCase())
                            }
                            className="w-full input input-bordered"
                            placeholder="22AAAAA0000A1Z5"
                          />
                        )}
                      </Field>
                    </TextField>
                  </div>
                </div>

                {/* Service Configuration Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Service Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField label="Allowed Cities *" name="allowedCities" hasChildren value={values.allowedCities}>
                      <Field name="allowedCities">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={values.allowedCities}
                            options={locationOptions}
                            isMulti={true}
                            loading={loadingLocations}
                            onChange={(e: any) => setFieldValue("allowedCities", e)}
                            placeholder="Select cities where partner operates"
                            hidePlaceholder
                          />
                        )}
                      </Field>
                    </TextField>

                    <TextField label="Allowed Categories *" name="allowedCategories" hasChildren value={values.allowedCategories}>
                      <Field name="allowedCategories">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={values.allowedCategories}
                            options={categoryOptions}
                            isMulti={true}
                            loading={loadingCategories}
                            onChange={(e: any) => setFieldValue("allowedCategories", e)}
                            placeholder="Select product categories"
                            hidePlaceholder
                          />
                        )}
                      </Field>
                    </TextField>
                  </div>
                </div>

                {/* Allowed Pincodes Section */}
                <div>
                  <AllowedPincodes
                    value={values.allowedPincodes || []}
                    onChange={(pincodes) => setFieldValue("allowedPincodes", pincodes)}
                    error={touched.allowedPincodes && errors.allowedPincodes ? String(errors.allowedPincodes) : undefined}
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold mb-2">Supported Services *</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {AVAILABLE_SERVICES.map((service) => (
                      <div key={service.id} className="flex items-center">
                        <ActionCheckboxV2
                          checkboxLabel={service.label}
                          id={`service-${service.id}`}
                          name="supportedServices"
                          checked={(values.supportedServices || []).includes(service.id)}
                          onChange={() => {
                            const current = values.supportedServices || [];
                            if (current.includes(service.id)) {
                              setFieldValue(
                                "supportedServices",
                                current.filter((s: string) => s !== service.id)
                              );
                            } else {
                              setFieldValue("supportedServices", [...current, service.id]);
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.supportedServices && (
                    <div className="text-xs text-red-500 mt-1">{errors.supportedServices}</div>
                  )}
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
