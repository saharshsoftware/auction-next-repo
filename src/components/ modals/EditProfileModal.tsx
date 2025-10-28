'use client';
import React, { useEffect, useMemo, useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Form, Field } from "formik";
import { BUDGET_RANGES, ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from "../../shared/Constants";
import * as Yup from "yup";
import { handleOnSettled, getCityNamesCommaSeparated, sanitizeReactSelectOptions, userTypeOptions, getCategoryNamesCommaSeparated, normalizeBudgetRanges } from "@/shared/Utilies";
import { updateProfileServiceClient } from "@/services/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import BudgetRangesSelect from "../atoms/BudgetRangesSelect";
import { fetchLocationClient } from "@/services/location";
import { BudgetRange, BudgetRangeObject, ICategoryCollection, ILocations } from "@/types";
import { getCategoryBoxCollectionClient } from "@/services/auction";

interface IEditProfileModal {
  openModal: boolean;
  hideModal: () => void;
  currentInterestedCities?: string;
  currentInterestedCategories?: string;
  currentUserType?: string;
  budgetRanges?: BudgetRangeObject[];
  refetchUserProfile: () => void;
}

const validationSchema = Yup.object({
  interestedCities: Yup.array().min(1, ERROR_MESSAGE.INTERESTED_CITIES_REQUIRED),
});

const initialValues = {
  interestedCities: [],
};

const EditProfileModal: React.FC<IEditProfileModal> = (props) => {
  const { openModal, hideModal = () => {}, currentInterestedCities = "", currentInterestedCategories = "", budgetRanges = [], currentUserType = "", refetchUserProfile = () => {} } = props;
  const [respError, setRespError] = useState<string>("");
  const [citiesList, setCitiesList] = useState<ILocations[]>([]);
  const computedInterestedCities = currentInterestedCities ? currentInterestedCities.split(", ").map(city => ({ label: city, value: city, name: city })) : [];
  const computedInterestedCategories = currentInterestedCategories ? currentInterestedCategories.split(", ").map(category => ({ label: category, value: category, name: category })) : [];
  const computedUserType = currentUserType ? userTypeOptions.find(userType => userType.value === currentUserType) : userTypeOptions[0];
  const normalizedBudgetRanges = normalizeBudgetRanges(budgetRanges);

  // Fetch location options
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

  useEffect(() => {
    if (locationOptions) {
      const updatedData = locationOptions.filter(
        (item: ILocations) => item.type === "city"
      );
      setCitiesList(updatedData);
    }
  }, [locationOptions]);

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileServiceClient,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: () => {
          hideModal?.();
          refetchUserProfile?.();
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const updateProfile = (values: { interestedCities: any[], interestedCategories: any[], userType: any, budgetRanges: BudgetRangeObject[] }) => {
    const locations = values?.interestedCities?.length > 0
      ? getCityNamesCommaSeparated(values?.interestedCities)
      : "";

    const categories = values?.interestedCategories?.length > 0
      ? getCategoryNamesCommaSeparated(values?.interestedCategories)
      : "";
    
    const body = {
      interestedCities: locations,
      interestedCategories: categories,
      userType: values?.userType?.value,
      budgetRanges: values?.budgetRanges || [],
    };
    console.log(body);
    mutate(body);
  };

  const budgetOptions: {
    label: string;
    value: string;
  }[] = useMemo(() => 
    BUDGET_RANGES.map((b) => ({
      label: b.label,
      value: `${b.min}-${b.max}`, // Use min-max as unique identifier
    })), []
  );

  return (
    <CustomModal
      openModal={openModal}
      modalHeading={"Edit"}
      customWidthClass="md:w-[50%] sm:w-3/5 w-11/12"
    >
      <CustomFormikForm
        initialValues={{
          ...initialValues,
          interestedCities: computedInterestedCities,
          interestedCategories: computedInterestedCategories,
          userType: computedUserType,
          budgetRanges: normalizedBudgetRanges,
        }}
        wantToUseFormikEvent={true}
        validationSchema={validationSchema}
        handleSubmit={updateProfile}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }: any) => (
          <Form className="w-full">
            <div className="flex flex-col gap-4 ">
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
                      name="interested-cities"
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
                label={"Interested Categories (Upto 5 categories)"}
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
                      name="interested-categories"
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
                label={"User Type"}
                name={"userType"}
                hasChildren={true}
                value={values?.userType}
              >
                <Field name="userType">
                  {() => (
                    <ReactSelectDropdown
                      defaultValue={values?.userType}
                      options={userTypeOptions}
                      placeholder="Select user type"
                      name="user-type"
                      customClass="w-full"
                      isMulti={false}
                      hidePlaceholder={true}
                      isSearchable={false}
                      onChange={(e) => {  
                        setFieldValue("userType", e);
                      }}
                    />
                  )}
                </Field>
              </TextField>

              <TextField
                label={"Budget Ranges"}
                name={"budgetRanges"}
                hasChildren={true}
              >
                <Field name="budgetRanges">
                  {() => (
                    <BudgetRangesSelect
                      name="budget-ranges"
                      value={values?.budgetRanges}
                      onChange={(v) => setFieldValue("budgetRanges", v)}
                      customClass="w-full"
                    />
                  )}
                </Field>
              </TextField>
              {respError ? (
                <span className="text-center text-sm text-red-700">
                  {respError}
                </span>
              ) : null}
              
              <div className="flex justify-end items-center">
                <div className="flex justify-end items-center gap-4">
                  <ActionButton
                    text={"Cancel"}
                    onclick={hideModal}
                    customClass="btn btn-sm"
                    isActionButton={false}
                  />

                  <ActionButton
                    text={STRING_DATA.UPDATE}
                    isLoading={isPending}
                    isSubmit={true}
                    customClass="btn btn-sm h-full min-w-24"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </CustomFormikForm>
    </CustomModal>
  );
};

export default EditProfileModal; 