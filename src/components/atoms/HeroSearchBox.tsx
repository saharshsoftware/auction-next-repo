"use client";
import React, { useState } from "react";
import ActionButton from "./ActionButton";
import ReactSelectDropdown from "./ReactSelectDropdown";
import CustomFormikForm from "./CustomFormikForm";
import TextField from "./TextField";
import { Field, Form } from "formik";
import {
  COOKIES,
  FILTER_EMPTY,
  RANGE_PRICE,
  REACT_QUERY,
  STRING_DATA,
} from "../../shared/Constants";
import { ROUTE_CONSTANTS } from "../../shared/Routes";
import {
  formatPrice,
  sanitizeReactSelectOptions,
  setDataInQueryParams,
} from "../../shared/Utilies";
import { useQuery } from "@tanstack/react-query";
import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";
import Link from "next/link";
import useLocalStorage from "@/hooks/useLocationStorage";
import { fetchBanksClient } from "@/services/bank";
import { fetchLocationClient } from "@/services/location";
import { getAssetTypeClient, getCategoryBoxCollectionClient } from "@/services/auction";
import RangeSliderCustom from "./RangeSliderCustom";
import dynamic from "next/dynamic";

// const ReactSelectDropdown = dynamic(() => import("./ReactSelectDropdown"), {
//   ssr: false,
// });

// const CustomFormikForm = dynamic(() => import("./CustomFormikForm"), {
//   ssr: false,
// });

// const TextField = dynamic(() => import("./TextField"), {
//   ssr: false,
// });

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
  price: [0, RANGE_PRICE.MAX] ?? STRING_DATA.EMPTY,
};

const gridElementClass = () => "lg:col-span-6 col-span-full";
const separatorClass = () => "border-dashed border-2 border-gray-300 w-full";
const HeroSearchBox = () => {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [auctionFilter, setAuctionFilter] = useLocalStorage(COOKIES.AUCTION_FILTER, FILTER_EMPTY);

    const {
      data: assetsTypeOptions,
      isLoading: isLoadingAssetsTypeCategory,
    } = useQuery({
      queryKey: [REACT_QUERY.ASSETS_TYPE],
      queryFn: async () => {
        const res = (await getAssetTypeClient()) as unknown as IAssetType[];
        return sanitizeReactSelectOptions(res) ?? [];
      },
    });

  const { data: categoryOptions, isLoading: isLoadingCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollectionClient()) as unknown as ICategoryCollection[];
      return sanitizeReactSelectOptions(res) ?? [];
    },
    staleTime: 0,
  });

  const { data: bankOptions, isLoading: isLoadingBank } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanksClient()) as unknown as IBanks[];
      return sanitizeReactSelectOptions(res) ?? [];
    },
  });

  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];
      return sanitizeReactSelectOptions(res) ?? [];
    },
  });

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

  const handleSearchButton = (values: IFilter) => {
    setAuctionFilter(values);
    // const q = getFilterQuery(values);
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
                    label={"Asset type"}
                    name={"propertyType"}
                    hasChildren={true}
                  >
                    <Field name="propertyType">
                      {() => (
                        <ReactSelectDropdown
                          defaultValue={values?.propertyType ?? null}
                          options={assetsTypeOptions ?? []}
                          placeholder={"Asset type"}
                          loading={isLoadingAssetsTypeCategory}
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
                          loading={isLoadingCategory}
                          customClass="w-full "
                          onChange={(e: any) => {
                            setFieldValue("category", e);
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
                          loading={isLoadingLocation}
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
                          loading={isLoadingBank}
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
                <div className="col-span-full">
                  <div className="flex items-center justify-between w-full gap-2">
                    <hr className={separatorClass()} />
                    <span className="min-w-fit text-blue-500">OR</span>
                    <hr className={separatorClass()} />
                  </div>
                </div>
                <div className={"col-span-full"}>
                  <TextField
                    type="text"
                    name="keyword"
                    label="Keyword"
                    placeholder="Enter keyword"
                    value={values.keyword}
                  />
                </div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <Link
                    href={{
                      pathname: ROUTE_CONSTANTS.AUCTION,
                      // pathname: "/",
                      query: { q: getFilterQuery(values) },
                    }}
                  >
                    <ActionButton
                      text={STRING_DATA.SEARCH.toUpperCase()}
                      isLoading={loadingSearch}
                      onclick={() => handleSearchButton(values)}
                      customClass={
                        "rounded-full btn-lg lg:px-12 lg:py-4 px-10 py-6 min-w-fit lg:min-w-[150px]"
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
