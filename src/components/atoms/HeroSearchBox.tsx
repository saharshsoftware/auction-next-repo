"use client";
import React, { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import CustomBadge from "./CustomBadge";
import ReactSelectDropdown from "./ReactSelectDropdown";
import { Field, Form } from "formik";
import CustomFormikForm from "./CustomFormikForm";
import TextField from "./TextField";
import {
  CATEGORIES,
  COOKIES,
  ERROR_MESSAGE,
  FILTER_EMPTY,
  POPULER_CITIES,
  RANGE_PRICE,
  REACT_QUERY,
  STRING_DATA,
} from "../../shared/Constants";
import * as Yup from "yup";
import { ROUTE_CONSTANTS } from "../../shared/Routes";
import { ItemRenderer, NoDataRendererDropdown } from "./NoDataRendererDropdown";
import {
  formatPrice,
  sanitizeReactSelectOptions,
  setDataInQueryParams,
} from "../../shared/Utilies";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchBanks, fetchLocation, getAuctionData, getCategoryBoxCollection } from "@/server/actions";
import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";
import Link from "next/link";
import { setCookie } from "cookies-next";
import useLocalStorage from "@/hooks/useLocationStorage";
import { fetchBanksClient } from "@/services/bank";
import { fetchLocationClient } from "@/services/location";
import { getAssetTypeClient } from "@/services/auction";
import RangeSliderCustom from "./RangeSliderCustom";

interface IFilter {
  category: string;
  price: string;
  bank: string;
  location: string;
}

const validationSchema = Yup.object({
  // propertyType: Yup.string().trim(),
  // category: Yup.string().trim(),
  // location: Yup.object(),
  // bank: Yup.string().trim(),
  // price: Yup.number(),
  // keyword: Yup.string(),
});

const initialValues = {
  propertyType: STRING_DATA.EMPTY,
  category: STRING_DATA.EMPTY,
  location: STRING_DATA.EMPTY,
  bank: STRING_DATA.EMPTY,
  keyword: STRING_DATA.EMPTY,
  price: [0, 500000000] ?? STRING_DATA.EMPTY,
};

const gridElementClass = () => "lg:col-span-6 col-span-full";
const separatorClass = () => "border-dashed border-2 border-gray-300 w-full";
const HeroSearchBox = () => {
  const router = useRouter();
  const [activeBadgeData, setActiveBadgeData] = useState(POPULER_CITIES?.[0]);
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
        (await getCategoryBoxCollection()) as unknown as ICategoryCollection[];
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

  const fetchAuctionRequest = async (values: {
    category: string;
    price: string;
    bank: string;
    location: string;
  }) => {
    const { category, price, bank, location } = values;
    const response = await getAuctionData({
      category: category,
      bankName: bank,
      reservePrice: price,
      location: location,
    });
    console.log("response> ", response);
    if (response) {
      const filters = { page: 1, ...values };
      const data = setDataInQueryParams(filters);

      setAuctionFilter(filters);
      
      // router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);
    }
  };

  const getFilterQuery = (values: {
    category: any;
    price: any;
    bank: any;
    location: any;
    propertyType: any;
    keyword?: string;
  }) => {
    console.log(values, "Vakyes");
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
    console.log(filter, "hero-filter");
    // debugger
    return setDataInQueryParams(filter);
  };

  const handleSubmit = (values: any) => {};

  const handleBadgeClick = (data: any) => {
    setActiveBadgeData(data);
  };

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
          validationSchema={validationSchema}
          wantToUseFormikEvent={true}
        >
          {({ setFieldValue, values }: any) => (
            <Form>
              {/* {JSON.stringify(values)} */}
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
                  <TextField label="Price" name="price" hasChildren={true}>
                    <Field name="price">
                      {() => (
                        <>
                          <div className="text-black flex items-center gap-4 absolute top-0 right-0">
                            <span>{formatPrice(values?.price?.[0])}</span> - 
                            <span>{formatPrice(values?.price?.[1])}</span>
                          </div>
                          <RangeSliderCustom
                            value={values.price}
                            onInput={(value: any, e: any) => {
                              console.log(value);
                              setFieldValue("price", value);
                            }}
                          />
                        </>
                      )}
                    </Field>
                  </TextField>
                  {/* <TextField
                    type="range"
                    name="price"
                    label="Price"
                    placeholder="Enter price"
                    value={values.price}
                    min={RANGE_PRICE.MIN}
                    max={RANGE_PRICE.MAX}
                    step={RANGE_PRICE.STEPS}
                    customClass={"custom-range-class"}
                  /> */}
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
