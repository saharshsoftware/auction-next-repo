"use client";
import React, { useState } from "react";
import ActionButton from "./ActionButton";
import ReactSelectDropdown from "./ReactSelectDropdown";
import CustomFormikForm from "./CustomFormikForm";
import TextField from "./TextField";
import { Field, Form } from "formik";
import { COOKIES, RANGE_PRICE, STRING_DATA } from "../../shared/Constants";
import { ROUTE_CONSTANTS } from "../../shared/Routes";
import { formatPrice, setDataInQueryParams } from "../../shared/Utilies";
import Link from "next/link";
import RangeSliderCustom from "./RangeSliderCustom";
// import SavedSearchList from "./SavedSearchList";
const SavedSearchList = dynamic(() => import("./SavedSearchList"), {
  ssr: false,
});
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { IFilters, useFilterStore } from "@/zustandStore/filters";
import { trackSearch } from "@/helpers/SurveyHelper";
import { IAssetType } from "@/types";

interface IFilter {
  category: string;
  price: string;
  bank: string;
  location: string;
}

const initialValues = {
  propertyType: STRING_DATA.EMPTY,
  category: STRING_DATA.EMPTY,
  location: STRING_DATA.EMPTY,
  bank: STRING_DATA.EMPTY,
  keyword: STRING_DATA.EMPTY,
  price: [0, RANGE_PRICE.MAX],
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
  const { setFilter } = useFilterStore();

  const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [filteredAssets, setFilteredAssets] = useState<IAssetType[]>(
    assetsTypeOptions ?? []
  );
  const getFilterQuery = (values: {
    category: any;
    price: any;
    bank: any;
    location: any;
    propertyType: any;
    keyword?: string;
  }) => {
    // console.log(values, "Vakyes");
    const { category, price, bank, location, propertyType, keyword } = values;
    const { type, name } = location ?? {};
    const filter = {
      page: 1,
      category,
      price,
      bank,
      locationType: type,
      location,
      propertyType,
      keyword,
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
    setFieldValue("propertyType", ""); // Reset propertyType

    // Filter asset types based on the selected category
    const filteredOptions = assetsTypeOptions.filter(
      (item: IAssetType) => item?.category?.slug === selectedCategorySlug
    );
    setFilteredAssets(
      filteredOptions?.length > 0 ? filteredOptions : assetsTypeOptions
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg flex flex-col gap-4 relative pb-12 shadow shadow-brand-color border">
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
                          options={categoryOptions ?? []}
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
                    label={"Asset type"}
                    name={"propertyType"}
                    hasChildren={true}
                  >
                    <Field name="propertyType">
                      {() => (
                        <ReactSelectDropdown
                          defaultValue={values?.propertyType ?? null}
                          options={filteredAssets ?? []}
                          placeholder={"Asset type"}
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
                          options={locationOptions}
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
                          options={bankOptions}
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
                <div className={"col-span-full"}>
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

                {token ? (
                  <div className={"col-span-full"}>
                    <SavedSearchList />
                  </div>
                ) : null}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <Link
                    href={{
                      pathname: ROUTE_CONSTANTS.AUCTION,
                      // pathname: "/",
                      query: { q: getFilterQuery(values) },
                    }}
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
