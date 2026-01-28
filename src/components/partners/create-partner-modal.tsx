"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import * as Yup from "yup";
import { Field, Form, FormikHelpers, FormikValues } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-simple-toasts";
import {
  STRING_DATA,
  COOKIES,
  REACT_QUERY,
  getEmptyAllObject,
  ERROR_MESSAGE,
} from "@/shared/Constants";
import { createPartnerClient } from "@/services/partners";
import { useUserData } from "@/hooks/useAuthenticated";
import { getCookie } from "cookies-next";
import { CONFIG } from "@/utilies/Config";
import { useRouter } from "next/navigation";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import { ILocations } from "@/types";
import { sanitizeReactSelectOptions } from "@/shared/Utilies";
import { fetchLocationClient } from "@/services/location";

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
  state: Yup.object().notRequired(),
  city: Yup.object().notRequired(),
  pincode: Yup.string()
    .matches(/^\d*$/, "Digits only")
    .max(6, "Must be 6 digits")
    .notRequired(),
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
  state: null,
  city: null,
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
  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];
      const responseData = res ?? [];
      const updatedData = [...sanitizeReactSelectOptions(responseData)];
      return updatedData ?? [];
    },
  });

  const states = locationOptions?.filter((item: ILocations) => item.type === "state");
  const cities = locationOptions?.filter((item: ILocations) => item.type === "city");

  const router = useRouter();
  const [shouldPrefill, setShouldPrefill] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState(initialValues);
  const { userData } = useUserData();
  const [selectedState, setSelectedState] = useState<any>(null);

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
        state: null,
        city: null,
      });
    }
  }, [shouldPrefill]);

  useEffect(() => {
    if (!shouldPrefill || !locationOptions?.length) return;
    setFormInitialValues((prev) => {
      if (prev.state || prev.city) return prev;
      const stateOption = states?.find(
        (item) =>
          item?.label?.toLowerCase() === dummyValues.state.toLowerCase() ||
          item?.name?.toLowerCase() === dummyValues.state.toLowerCase()
      );
      const cityOption = cities?.find(
        (item) =>
          item?.label?.toLowerCase() === dummyValues.city.toLowerCase() ||
          item?.name?.toLowerCase() === dummyValues.city.toLowerCase()
      );
      return {
        ...prev,
        state: stateOption ?? null,
        city: cityOption ?? null,
      };
    });
  }, [shouldPrefill, locationOptions]);

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

  const getLocationValue = (option: any) => {
    if (!option) return "";
    if (typeof option === "string") return option;
    if (option?.label === STRING_DATA.ALL) return option?.value ?? "";
    return option?.label ?? option?.name ?? option?.value ?? "";
  };

  const mapPartnerFormToApi = (values: any) => {
    const city = getLocationValue(values.city);
    const state = getLocationValue(values.state);
    return {
      name: values.name || "",
      email: values.email || "",
      phone: values.phone || "",
      contactPerson: values.contactPerson || "",
      GSTInfo: values.GSTInfo || "",
      ...(values.addressLine1 && { addressLine1: values.addressLine1 }),
      ...(values.addressLine2 && { addressLine2: values.addressLine2 }),
      ...(state && { state: state }),
      ...(city && { city: city }),
      ...(values.pincode && { pincode: values.pincode }),
    };
  };

  const handlePartnerSubmit = (values: any, helpers: FormikHelpers<FormikValues>) => {
    const payload = mapPartnerFormToApi(values);
    console.log("payload", payload);
    // mutate({ formData: payload });
  };

  const handleCityChange = (e: any, setFieldValue: any) => {
    if (!e) {
      setFieldValue("city", null);
      return;
    }
    setFieldValue("city", e.label === STRING_DATA.ALL ? getEmptyAllObject() : e);
  };
  const handleStateChange = (e: any, setFieldValue: any) => {
    if (!e) {
      setSelectedState(null);
      setFieldValue("state", null);
      setFieldValue("city", null);
      return;
    }
    setSelectedState(e);
    setFieldValue("state", e.label === STRING_DATA.ALL ? getEmptyAllObject() : e);
    setFieldValue("city", null);
  };

  const isCityInSelectedState = (cityOption: ILocations, stateOption: any) => {
    if (!stateOption) return true;
    const cityState = (cityOption as any)?.state;
    if (!cityState) return true;
    const stateLabel = stateOption?.label ?? stateOption?.name ?? stateOption?.value ?? "";
    const stateValue = stateOption?.value ?? stateOption?.id ?? "";

    if (typeof cityState === "string") {
      return cityState.toLowerCase() === String(stateLabel).toLowerCase();
    }
    if (typeof cityState === "number") {
      return cityState === stateValue;
    }
    if (typeof cityState === "object") {
      const cityStateLabel =
        cityState?.label ?? cityState?.name ?? cityState?.value ?? cityState?.id ?? "";
      return (
        String(cityStateLabel).toLowerCase() === String(stateLabel).toLowerCase() ||
        cityState?.id === stateValue ||
        cityState?.value === stateValue
      );
    }
    return false;
  };

  const getFilteredCities = (stateOption: any) => {
    if (!cities?.length) return [];
    if (stateOption?.label === STRING_DATA.ALL) return cities;
    return cities.filter((cityOption: ILocations) =>
      isCityInSelectedState(cityOption, stateOption)
    );
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
          const filteredCities = getFilteredCities(values.state ?? selectedState);
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
                    {/* State */}
                    <TextField
                      label="State"
                      name="state"
                      hasChildren
                    >
                      <Field name="state">
                        {() => (
                          <ReactSelectDropdown
                            name="state"
                            options={states ?? []}
                            loading={isLoadingLocation}
                            placeholder={"State"}
                            defaultValue={values.state}
                            onChange={(e) => handleStateChange(e, setFieldValue)}
                          />
                        )}
                      </Field>
                    </TextField>

                    <TextField
                      label="City"
                      name="city"
                      hasChildren
                    >
                      <Field name="city">
                        {() => (
                          <ReactSelectDropdown
                            name="city"
                            options={filteredCities ?? []}
                            loading={isLoadingLocation}
                            placeholder={"City"}
                            defaultValue={values.city}
                            onChange={(e) => handleCityChange(e, setFieldValue)}
                          />
                        )}
                      </Field>
                    </TextField>
                    <TextField
                      name="pincode"
                      label="Pincode"
                      value={values.pincode}
                      placeholder="400001"
                      onChange={(e: any) =>
                        setFieldValue("pincode", String(e.target.value).replace(/\D/g, ""))
                      }
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
