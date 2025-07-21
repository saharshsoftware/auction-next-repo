'use client';
import React, { useEffect, useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Form, Field } from "formik";
import { ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from "../../shared/Constants";
import * as Yup from "yup";
import { handleOnSettled, getCityNamesCommaSeparated, sanitizeReactSelectOptions } from "@/shared/Utilies";
import { updateProfileServiceClient } from "@/services/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import { fetchLocationClient } from "@/services/location";
import { ILocations } from "@/types";

interface IEditProfileModal {
  openModal: boolean;
  hideModal: () => void;
  currentInterestedCities?: string;
  refetchUserProfile: () => void;
}

const validationSchema = Yup.object({
  interestedCities: Yup.array().min(1, ERROR_MESSAGE.INTERESTED_CITIES_REQUIRED),
});

const initialValues = {
  interestedCities: [],
};

const EditProfileModal: React.FC<IEditProfileModal> = (props) => {
  const { openModal, hideModal = () => {}, currentInterestedCities = "", refetchUserProfile = () => {} } = props;
  const [respError, setRespError] = useState<string>("");
  const [citiesList, setCitiesList] = useState<ILocations[]>([]);
  const computedInterestedCities = currentInterestedCities ? currentInterestedCities.split(", ").map(city => ({ label: city, value: city, name: city })) : [];

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

  const updateProfile = (values: { interestedCities: any[] }) => {
    const locations = values?.interestedCities?.length > 0
      ? getCityNamesCommaSeparated(values?.interestedCities)
      : "";
    
    const body = {
      interestedCities: locations,
    };
    console.log(body);
    mutate(body);
  };

  return (
    <CustomModal
      openModal={openModal}
      modalHeading={"Edit"}
      customWidthClass="md:w-[50%] sm:w-3/5 w-11/12"
    >
      <CustomFormikForm
        initialValues={{
          ...initialValues,
          interestedCities: computedInterestedCities
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