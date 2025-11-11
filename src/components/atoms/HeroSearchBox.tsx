"use client";
import React, { useEffect, useMemo, useState } from "react";
import ActionButton from "./ActionButton";
import ReactSelectDropdown from "./ReactSelectDropdown";
import CustomFormikForm from "./CustomFormikForm";
import TextField from "./TextField";
import { Field, Form } from "formik";
import { COOKIES, RANGE_PRICE, SORT_OPTIONS, STRING_DATA, getEmptyAllObject } from "../../shared/Constants";
import { ROUTE_CONSTANTS } from "../../shared/Routes";
import { formatPrice, hasBudgetRanges, hasValue, setDataInQueryParams } from "../../shared/Utilies";
import Link from "next/link";
import RangeSliderCustom from "./RangeSliderCustom";
import { getCookie, setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { IFilters, useFilterStore } from "@/zustandStore/filters";
import { trackSearch } from "@/helpers/SurveyHelper";
import { IAssetType, BudgetRangeObject } from "@/types";
import { SERVICE_PROVIDER_OPTIONS } from "@/shared/Utilies";
import InlineWarningToast from "./inline-warning-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/zustandStore/authStore";

const initialValues = {
  propertyType: getEmptyAllObject(),
  category: getEmptyAllObject(),
  location: getEmptyAllObject(),
  bank: getEmptyAllObject(),
  keyword: STRING_DATA.EMPTY,
  price: [0, RANGE_PRICE.MAX],
  serviceProvider: getEmptyAllObject(),
};

const gridElementClass = () => "lg:col-span-6 col-span-full";
const separatorClass = () => "border-dashed border-2 border-gray-300 w-full";
const HeroSearchBox = (props: {
  assetsTypeOptions: any;
  categoryOptions: any;
  bankOptions: any;
  locationOptions: any;
}) => {
  const { assetsTypeOptions, bankOptions, categoryOptions, locationOptions } =
    props;

  // Add "All" option to each dropdown options array
  const categoryOptionsWithAll = [getEmptyAllObject(), ...(categoryOptions ?? [])];
  const bankOptionsWithAll = [getEmptyAllObject(), ...(bankOptions ?? [])];
  const locationOptionsWithAll = [getEmptyAllObject(), ...(locationOptions ?? [])];
  const assetsTypeOptionsWithAll = [getEmptyAllObject(), ...(assetsTypeOptions ?? [])];
  const { setFilter } = useFilterStore();

  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isProfileToastDismissed, setProfileToastDismissed] = useState<boolean>(false);

  const [filteredAssets, setFilteredAssets] = useState<IAssetType[]>(
    assetsTypeOptionsWithAll ?? []
  );
  const isAuthenticated = token.length > 0;
  const { userProfileData, isLoading: isLoadingUserProfile } = useUserProfile(isAuthenticated);
  const setNewUserStatus = useAuthStore((state) => state.setNewUserStatus);
  const isProfileIncomplete = useMemo(() => {
    if (!userProfileData) {
      return false;
    }
    const hasCities = hasValue(userProfileData.interestedCities);
    const hasCategories = hasValue(userProfileData.interestedCategories);
    const hasBudgets = hasBudgetRanges(userProfileData.budgetRanges);
    return !(hasCities && hasCategories && hasBudgets);
  }, [userProfileData]);
  useEffect(() => {
    if (!isProfileIncomplete) {
      setProfileToastDismissed(false);
    }
  }, [isProfileIncomplete]);
  const shouldShowProfileToast =
    isAuthenticated &&
    !isLoadingUserProfile &&
    isProfileIncomplete &&
    !isProfileToastDismissed;
  const getFilterQuery = (values: {
    category: any;
    price: any;
    bank: any;
    location: any;
    propertyType: any;
    keyword?: string;
    serviceProvider?: any;
  }) => {
    // console.log(values, "Vakyes");
    const { category, price, bank, location, propertyType, keyword, serviceProvider } = values;
    const { type, name } = location ?? {};
    const filter = {
      page: 1,
      category: category?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : category,
      price,
      bank: bank?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : bank,
      locationType: type,
      location: location?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : location,
      propertyType: propertyType?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : propertyType,
      keyword,
      serviceProvider: serviceProvider?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : serviceProvider,
    };
    // console.log(filter, "hero-filter");
    // debugger
    return setDataInQueryParams(filter);
  };

  const handleSubmit = (values: any) => {};

  const handleSearchButton = (values: IFilters) => {
    setFilter(values);
    trackSearch();
    // const q = getFilterQuery(values);
  };

  const handleCategoryChange = (
    selectedCategorySlug: string,
    setFieldValue: any
  ) => {
    setFieldValue("propertyType", getEmptyAllObject()); // Reset propertyType to "All"

    // If "All" is selected or no specific category, show all assets with "All" option
    if (!selectedCategorySlug || selectedCategorySlug === "") {
      setFilteredAssets(assetsTypeOptionsWithAll);
      return;
    }

    // Filter asset types based on the selected category
    const filteredOptions = assetsTypeOptions.filter(
      (item: IAssetType) => item?.category?.slug === selectedCategorySlug
    );
    
    // Always include "All" option at the beginning
    const filteredOptionsWithAll = [getEmptyAllObject(), ...filteredOptions];
    setFilteredAssets(
      filteredOptions?.length > 0 ? filteredOptionsWithAll : assetsTypeOptionsWithAll
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg flex flex-col gap-4 relative pb-12 shadow shadow-brand-color border">
        {shouldShowProfileToast ? (
          <InlineWarningToast
            title="Complete your preferences"
            description="Add your interested cities, categories, and budget ranges to unlock better property recommendations."
            actionLabel="Update now"
            onAction={() => setNewUserStatus(true)}
            onClose={() => setProfileToastDismissed(true)}
          />
        ) : null}
        <CustomFormikForm
          initialValues={initialValues}
          handleSubmit={handleSubmit}
          wantToUseFormikEvent={true}
        >
          {({ setFieldValue, values }: any) => (
            <Form>
              {/* {JSON.stringify(values?.propertyType)} */}
              <div className="grid gap-4 grid-cols-12 w-full ">
                <div className={gridElementClass()}>
                  <TextField
                    label={"Categories"}
                    name={"category"}
                    hasChildren={true}
                  >
                    <Field name="category">
                      {() => (
                        <ReactSelectDropdown
                          defaultValue={values?.category ?? null}
                          options={categoryOptionsWithAll ?? []}
                          placeholder={"Category"}
                          name="category-search-box"
                          // loading={isLoadingCategory}
                          customClass="w-full "
                          onChange={(e: any) => {
                            setFieldValue("category", e);
                            handleCategoryChange(e?.slug, setFieldValue);
                          }}
                        />
                      )}
                    </Field>
                  </TextField>
                </div>
                <div className={gridElementClass()}>
                  <TextField
                    label={"Property type"}
                    name={"propertyType"}
                    hasChildren={true}
                  >
                    <Field name="propertyType">
                      {() => (
                        <ReactSelectDropdown
                          defaultValue={values?.propertyType ?? null}
                          options={filteredAssets ?? []}
                          placeholder={"Property type"}
                          name="asset-type-search-box"
                          // loading={isLoadingAssetsTypeCategory}
                          customClass="w-full "
                          onChange={(e: any) => {
                            // console.log(e, "formik")
                            setFieldValue("propertyType", e);
                          }}
                        />
                      )}
                    </Field>
                  </TextField>
                </div>
                <div className={gridElementClass()}>
                  <TextField
                    label={"Location (City & State)"}
                    name={"location"}
                    hasChildren={true}
                  >
                    <Field name="location">
                      {() => (
                        <ReactSelectDropdown
                          defaultValue={values?.location ?? null}
                          // loading={isLoadingLocation}
                          name="location-search-box"
                          options={locationOptionsWithAll}
                          placeholder={"Neighborhood, City or State"}
                          customClass="w-full "
                          onChange={(e: any) => {
                            setFieldValue("location", e);
                          }}
                        />
                      )}
                    </Field>
                  </TextField>
                </div>
                <div className={gridElementClass()}>
                  <TextField label="Bank" name="bank" hasChildren={true}>
                    <Field name="bank">
                      {() => (
                        <ReactSelectDropdown
                          defaultValue={values?.bank ?? null}
                          options={bankOptionsWithAll}
                          // loading={isLoadingBank}
                          name="bank-search-box"
                          placeholder={"Banks"}
                          customClass="w-full "
                          onChange={(e: any) => {
                            setFieldValue("bank", e);
                          }}
                        />
                      )}
                    </Field>
                  </TextField>
                </div>
                {/* <div className={gridElementClass()}>

                <TextField label="Service Provider" name="serviceProvider" hasChildren>
                  <Field name="serviceProvider">
                    {() => (
                      <ReactSelectDropdown
                        name="serviceProvider"
                        options={SERVICE_PROVIDER_OPTIONS}
                        placeholder={"Service Provider"}
                        defaultValue={values.serviceProvider}
                        onChange={(value) => setFieldValue("serviceProvider", value)}
                      />
                    )}
                  </Field>
                </TextField>
                </div> */}
                <div className={`col-span-full`}>
                  <TextField
                    label="Price range"
                    name="price"
                    hasChildren={true}
                  >
                    <Field name="price">
                      {() => (
                        <div className="relative w-full space-y-2">
                          <RangeSliderCustom
                            value={values.price}
                            onInput={(value: any, e: any) => {
                              console.log(value);
                              setFieldValue("price", value);
                            }}
                          />
                          <div className="text-black flex items-center justify-between gap-4 ">
                            <span className="text-sm text-gray-900">
                              {formatPrice(values?.price?.[0])}
                            </span>{" "}
                            <span className="text-sm text-gray-900">
                              {formatPrice(values?.price?.[1])}
                            </span>
                          </div>
                        </div>
                      )}
                    </Field>
                  </TextField>
                </div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <Link
                    href={{
                      pathname: ROUTE_CONSTANTS.AUCTION,
                      // pathname: "/",
                      query: { q: getFilterQuery(values) },
                    }}
                    onClick={() => setCookie(COOKIES.SORT_KEY, SORT_OPTIONS[0].value)}
                    prefetch={false}
                  >
                    <ActionButton
                      text={STRING_DATA.SEARCH.toUpperCase()}
                      isLoading={loadingSearch}
                      onclick={() => handleSearchButton(values)}
                      customClass={
                        "rounded-full btn-lg lg:px-12 lg:py-4 md:px-10 xs:px-8 py-6 min-w-fit lg:min-w-[150px]"
                      }
                    />
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </CustomFormikForm>
      </div>
    </>
  );
};

export default HeroSearchBox;
