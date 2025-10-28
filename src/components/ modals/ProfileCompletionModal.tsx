'use client';
import React, { useEffect, useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Form, Field } from "formik";
import { BUDGET_RANGES, REACT_QUERY } from "../../shared/Constants";
import * as Yup from "yup";
import { getCityNamesCommaSeparated, sanitizeReactSelectOptions, userTypeOptions, getCategoryNamesCommaSeparated, normalizeBudgetRanges } from "@/shared/Utilies";
import { updateProfileServiceClient } from "@/services/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import { fetchLocationClient } from "@/services/location";
import { BudgetRangeObject, ICategoryCollection, ILocations } from "@/types";
import { getCategoryBoxCollectionClient } from "@/services/auction";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMemo } from "react";
import BudgetRangesSelect from "../atoms/BudgetRangesSelect";

interface IProfileCompletionModal {
  openModal: boolean;
  hideModal: () => void;
}

const validationSchema = Yup.object({
  interestedCities: Yup.array().optional(),
  interestedCategories: Yup.array().optional(),
  userType: Yup.object().required("User type is required"),
});


const ProfileCompletionModal: React.FC<IProfileCompletionModal> = (props) => {
  const { openModal, hideModal = () => {}} = props;
  const [respError, setRespError] = useState<string>("");
  const [citiesList, setCitiesList] = useState<ILocations[]>([]);
  
  // Get current user profile data to pre-fill the form
  const { userProfileData: userProfile } = useUserProfile();
  
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

  // Prepare initial values with existing profile data
  const getInitialValues = () => {
    const computedInterestedCities = userProfile?.interestedCities 
      ? userProfile.interestedCities.split(", ").map(city => ({ label: city, value: city, name: city }))
      : [];
    
    const computedInterestedCategories = userProfile?.interestedCategories 
      ? userProfile.interestedCategories.split(", ").map(category => ({ label: category, value: category, name: category }))
      : [];
    
    const computedUserType = userProfile?.userType 
      ? userTypeOptions.find(userType => userType.value === userProfile.userType)
      : userTypeOptions[0];


    const normalizedBudgetRanges = normalizeBudgetRanges(userProfile?.budgetRanges);
    
    return {
      interestedCities: computedInterestedCities,
      interestedCategories: computedInterestedCategories,
      userType: computedUserType,
      budgetRanges: normalizedBudgetRanges,
    };
  };

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileServiceClient,
    onSuccess: (data) => {
      hideModal?.();

    },
    onError: (error) => {
      const { message } = error;
      setRespError(message);
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
      modalHeading={"Complete Your Profile"}
      customWidthClass="md:w-[50%] sm:w-3/5 w-11/12"
      isCrossVisible={true}
      onClose={hideModal}
    >
      <CustomFormikForm
        initialValues={getInitialValues()}
        wantToUseFormikEvent={true}
        validationSchema={validationSchema}
        handleSubmit={updateProfile}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }: any) => (
          <Form className="w-full">
            <div className="flex flex-col gap-4 ">
              <div className="mb-4">
                <p className="text-gray-600">
                Helps us personalize recommendations for you. This information helps us personalize your experience. You can skip this step
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
              
              <div className="flex justify-center items-center">
                <ActionButton
                  text={userProfile?.userType ? "Update Profile" : "Complete Profile"}
                  isLoading={isPending}
                  isSubmit={true}
                  customClass="btn btn-primary w-full"
                />
              </div>
            </div>
          </Form>
        )}
      </CustomFormikForm>
    </CustomModal>
  );
};

export default ProfileCompletionModal;
