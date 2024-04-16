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
  getBankOptions,
  getCategoryOptions,
  handleQueryResponse,
  hasNonEmptyOrNullValue,
  setDataInQueryParams,
} from "../../shared/Utilies";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchBanks, fetchLocation, getAuctionData, getCategoryBoxCollection } from "@/server/actions";
import { IBanks, ICategoryCollection, ILocations } from "@/types";
import Link from "next/link";
import { setCookie } from "cookies-next";
import useLocalStorage from "@/hooks/useLocationStorage";

interface IFilter {
  category: string;
  price: string;
  bank: string;
  location: string;
}

const validationSchema = Yup.object({
  category: Yup.string().trim(),
  location: Yup.string().trim(),
  bank: Yup.string().trim(),
  price: Yup.number()
});

const initialValues = {
  category: STRING_DATA.EMPTY,
  location: STRING_DATA.EMPTY,
  bank: STRING_DATA.EMPTY,
  price: '250000000' ?? STRING_DATA.EMPTY,
};

const gridElementClass = () => "lg:col-span-6 col-span-full";

const HeroSearchBox = () => {
  const router = useRouter();
  const [activeBadgeData, setActiveBadgeData] = useState(POPULER_CITIES?.[0]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [auctionFilter, setAuctionFilter] = useLocalStorage(COOKIES.AUCTION_FILTER, FILTER_EMPTY);

  const { data: categoryOptions, isLoading: isLoadingCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollection()) as unknown as ICategoryCollection[];
      return (res) ?? [];
    },
    staleTime: 0,
  });

  const { data: bankOptions, isLoading: isLoadingBank } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanks()) as unknown as IBanks[];
      return getBankOptions(res) ?? [];
    },
  });

  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocation()) as unknown as ILocations[];
      return res ?? [];
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
    category: string;
    price: string;
    bank: string;
    location: string;
  }) => {
    return setDataInQueryParams({ page: 1, ...values });
  };

  const handleSubmit = async (values: any) => {
 
    setLoadingSearch(true);

    setTimeout(() => {
      setLoadingSearch(false);
    }, 1000);
    console.log(values);
    fetchAuctionRequest(values);
  };

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
                          noDataRenderer={NoDataRendererDropdown}
                          itemRenderer={ItemRenderer}
                          options={categoryOptions ?? []}
                          placeholder={"Category"}
                          loading={isLoadingCategory}
                          customClass="w-full "
                          onChange={(e: any) => {
                            setFieldValue("category", e?.[0]?.name);
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
                          noDataRenderer={NoDataRendererDropdown}
                          itemRenderer={ItemRenderer}
                          loading={isLoadingLocation}
                          options={locationOptions}
                          defaultValue={values?.location}
                          placeholder={"Neighborhood, City or State"}
                          customClass="w-full "
                          onChange={(e: any) => {
                            setFieldValue("location", e?.[0]?.name);
                          }}
                        />
                      )}
                    </Field>
                  </TextField>
                </div>
                <div className={"col-span-full"}>
                  <TextField label="Bank" name="bank" hasChildren={true}>
                    <Field name="bank">
                      {() => (
                        <ReactSelectDropdown
                          noDataRenderer={NoDataRendererDropdown}
                          itemRenderer={ItemRenderer}
                          options={bankOptions}
                          loading={isLoadingBank}
                          placeholder={"Banks"}
                          customClass="w-full "
                          onChange={(e: any) => {
                            setFieldValue("bank", e?.[0]?.name);
                          }}
                        />
                      )}
                    </Field>
                  </TextField>
                </div>
                <div className={"col-span-full"}>
                  <TextField
                    type="range"
                    name="price"
                    label="Price"
                    placeholder="Enter price"
                    value={values.price}
                    min={RANGE_PRICE.MIN}
                    max={RANGE_PRICE.MAX}
                    step={RANGE_PRICE.STEPS}
                    customClass={"custom-range-class"}
                  />
                </div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <Link
                    href={{
                      pathname: ROUTE_CONSTANTS.AUCTION,
                      query: { q: getFilterQuery(values) },
                    }}
                  >
                    <ActionButton
                      text={STRING_DATA.SEARCH.toUpperCase()}
                      isLoading={loadingSearch}
                      onclick={() => handleSearchButton(values)}
                      customClass={
                        "rounded-full btn-lg px-12 py-4 min-w-[150px]"
                      }
                    />
                    {STRING_DATA.SEARCH.toUpperCase()}
                  </Link>
                </div>
              </div>
              {/* {JSON.stringify(values?.location)}
              <TextField
                label={STRING_DATA.POPULER_CITIES}
                name="location"
                hasChildren={true}
              >
                <Field name="location">
                  {() => (
                    <div className="flex flex-wrap gap-2">
                      {locationOptions
                        ?.filter((item) => item?.isPopular)
                        .map((item, index) => (
                          <CustomBadge
                            key={index}
                            item={{ label: item?.name, ...item }}
                            activeBadge={activeBadgeData}
                            onclick={(data)=> {
                              console.log(data)
                              setActiveBadgeData(data)
                              setFieldValue('location', data?.name)
                            }}
                          />
                        ))}
                    </div>
                  )}
                </Field>
              </TextField> */}
            </Form>
          )}
        </CustomFormikForm>
      </div>
    </>
  );
};

export default HeroSearchBox;
