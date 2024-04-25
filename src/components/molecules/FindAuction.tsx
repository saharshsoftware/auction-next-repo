"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  COOKIES,
  FILTER_EMPTY,
  RANGE_PRICE,
  REACT_QUERY,
  STRING_DATA,
} from "../../shared/Constants";

import {
  formatPrice,
  getDataFromQueryParams,
  sanitizeReactSelectOptions,
} from "../../shared/Utilies";
import useModal from "../../hooks/useModal";
import CustomModal from "../atoms/CustomModal";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Field, Form } from "formik";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import * as Yup from "yup";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";
import useCustomParamsData from "@/hooks/useCustomParamsData";
import useFindUrl from "@/hooks/useFindUrl";
import { getAssetTypeClient, getCategoryBoxCollectionClient } from "@/services/auction";
import useLocalStorage from "@/hooks/useLocationStorage";
import { fetchBanksClient } from "@/services/bank";
import { fetchLocationClient } from "@/services/location";
import RangeSliderCustom from "../atoms/RangeSliderCustom";
import debounce from "lodash/debounce";

const gridElementClass = () => "lg:col-span-2  col-span-full";

interface IFindAuction {
  isCategoryRoute?: boolean;
  isLocationRoute?: boolean;
  isBankRoute?: boolean;
}

const getEmptyAllObject = () => ({
  // id: 0,
  // name: STRING_DATA.ALL,
  value: '',
  label: STRING_DATA.ALL,
});

const FindAuction = (props: IFindAuction) => {

  const params = useParams()
  const params_search = useSearchParams();
  const router = useRouter();
  const currentRoute = usePathname();
  const { showModal, openModal, hideModal } = useModal();
  const [auctionFilter, setAuctionFilter] = useLocalStorage(COOKIES.AUCTION_FILTER, FILTER_EMPTY);
  
  const { setDataInQueryParamsMethod, getDataFromQueryParamsMethod } =
    useCustomParamsData();
  const { data: categoryOptions, isLoading: isLoadingCategory ,refetch:refetchCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res = (await getCategoryBoxCollectionClient()) as unknown as ICategoryCollection[];
      const updatedData = [
        getEmptyAllObject(),
        ...sanitizeReactSelectOptions(res),
      ];
      if (currentRoute.startsWith("/category")) fillFilter(updatedData);
      return (updatedData) ?? [];
    },
  });

  const {
    data: assetsTypeOptions,
    isLoading: isLoadingAssetsTypeCategory,
    refetch: refetchAssetTypeCategory,
  } = useQuery({
    queryKey: [REACT_QUERY.ASSETS_TYPE],
    queryFn: async () => {
      const res = (await getAssetTypeClient()) as unknown as IAssetType[];
      const updatedData = [
        getEmptyAllObject(),
        ...sanitizeReactSelectOptions(res),
      ];
      if (currentRoute.startsWith("/category")) fillFilter(updatedData);
      return updatedData ?? [];
    },
  });

  const {
    data: bankOptions,
    isLoading: isLoadingBank,
    refetch: refetchBank,
  } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanksClient()) as unknown as IBanks[];
      const updatedData = [
        getEmptyAllObject(),
        ...sanitizeReactSelectOptions(res),
      ];
      // console.log(updatedData, "updateadslfk");
      if (currentRoute.startsWith("/bank")) fillFilter(updatedData);
      return updatedData ?? [];
    },
    // enabled: !currentRoute.startsWith("/bank"),
  });

  const { data: locationOptions, isLoading: isLoadingLocation, refetch:refetchLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];
      const responseData = res ?? [];
      const updatedData = [
        getEmptyAllObject(),
        ...sanitizeReactSelectOptions(responseData),
      ];
      if (currentRoute.startsWith("/location")) fillFilter(updatedData);
      return updatedData  ?? [];
    },
  });

  const [staticLoading, setStaticLoading] = useState(false);

  const [initialValueData, setInitialValueData] = useState<any>({
      propertyType: getEmptyAllObject(),
      bank: getEmptyAllObject(),
      price: STRING_DATA.EMPTY,
      location: getEmptyAllObject(),
      category: getEmptyAllObject(),
    }
  );

  // console.log(initialValueData, "initialValueData");

  useEffect(()=> {
    if (params?.slug) {
      if (currentRoute.startsWith("/category")) {
        fillFilter(categoryOptions)
        return;
      }
      if (currentRoute.startsWith("/bank")) {
        fillFilter(bankOptions);
        return;
      }
      if (currentRoute.startsWith("/location")) {
        fillFilter(locationOptions)
        return;
      }
    }
  }, [params?.slug])

  const fillFilter = (data: any) =>{
    if (currentRoute.startsWith("/category")) {
      const selectedOne = data?.find((item: any) => item?.slug === params?.slug);
      // console.log(selectedOne, "selectedOne");
      setInitialValueData({
        category: selectedOne ?? auctionFilter?.category ?? "",
      });
    }
    if (currentRoute.startsWith("/location")) {
      const selectedOne = data?.find((item: any) => item?.slug === params?.slug);
      // console.log(selectedOne, "selectedOne");
      setInitialValueData({
        location: selectedOne ?? auctionFilter?.location ?? "",
      });
    }
    if (currentRoute.startsWith("/bank")) {
      const selectedOne = data?.find((item: any) => item?.slug === params?.slug);
      // console.log(selectedOne, "selectedOne", auctionFilter?.bank);
      // debugger;
      setInitialValueData({
        bank: selectedOne ?? auctionFilter?.bank ?? "",
      });
    }
  }

  const [isMobileView, setIsMobileView] = useState({
    mobileView: false,
    isOpenTopbar: false,
  });

  const handleSubmit = (values: any) => {
    // console.log(values, "values123");
    const { category, price, bank, location, propertyType } = values;
    const { type, name } = location ?? {};
    const filter = {
      page: 1,
      category: category?.label === STRING_DATA.ALL?STRING_DATA.EMPTY :category,
      price,
      bank: bank?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : bank,
      locationType: type,
      location:
        location?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : location,
      propertyType: propertyType?.label === STRING_DATA.ALL?STRING_DATA.EMPTY :propertyType
    };
    // console.log(filter);
    setAuctionFilter(filter);
    const data:any = setDataInQueryParamsMethod(filter);
    // console.log(data)

    // setStaticLoading(true);

    setStaticLoading(true);
    setTimeout(() => {
      setStaticLoading(false);
    }, 1000);
    
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);

    hideModal?.();
  };

  const handleDropdownChange = (keyname: string,value:any, values:any) => {
    // debugger
    const { category, bank, price, propertyType , location} = values;
    const filter:any = {
      page: 1,
      category,
      bank,
      price,
      propertyType,
      location,
    };

    filter[keyname] = value,
    console.log(auctionFilter);

    setAuctionFilter(filter);
    const data: any = setDataInQueryParamsMethod(filter);
    // console.log(data)
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`)

  }


  const handleResize = () => {
    setIsMobileView((prev) => ({
      ...prev,
      mobileView: window.innerWidth < 1024,
    }));
  };

  useEffect(() => {
    if (params_search?.get("q")) {
      const updateFormData = structuredClone(
        getDataFromQueryParams(params_search.get("q") ?? "")
      );
      setInitialValueData({...updateFormData});
    }
  }, [params_search?.get("q")]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBack = () => {
    router.back();
  }

  const renderData = () => {
    if (!isMobileView.mobileView) {
      return <div className="common-section p-4">{renderForm()}</div>;
    }
    return (
      <>
        <div className="flex flex-row items-start justify-between gap-4 p-4">
          <div className="flex items-center justify-start gap-4">
            <em onClick={handleBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </em>
            <div className="flex flex-col gap-2">
              <p className="line-clamp-1">{initialValueData?.category?.name}</p>
              <p className="line-clamp-1">{initialValueData?.location?.name}</p>
            </div>
          </div>
          <span className="link primary-link" onClick={showModal}>
            Edit
          </span>
        </div>
      </>
    );
  };

  const renderForm = () => {
    return (
      <>
        <CustomFormikForm
          initialValues={{
            propertyType: initialValueData?.propertyType
              ? initialValueData?.propertyType
              : getEmptyAllObject(),
            bank: initialValueData?.bank
              ? initialValueData?.bank
              : getEmptyAllObject(),
            price: initialValueData?.price
              ? initialValueData?.price
              : [0, RANGE_PRICE.MAX],
            location: initialValueData?.location
              ? initialValueData?.location
              : getEmptyAllObject(),
            category: initialValueData?.category
              ? initialValueData?.category
              : getEmptyAllObject(),
          }}
          handleSubmit={handleSubmit}
          // validationSchema={validationSchema}
          wantToUseFormikEvent={true}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }: any) => (
            <Form>
              <div
                className={`flex ${
                  isMobileView.mobileView ? "flex-col" : "flex-row"
                } items-end justify-between gap-4 `}
              >
                <div className="grid gap-4 grid-cols-12 w-full ">
                  {/* {JSON.stringify(values.price)} */}

                  <div className={gridElementClass()}>
                    <TextField
                      label={"Categories"}
                      name={"category"}
                      hasChildren={true}
                    >
                      <Field name="category">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={values?.category}
                            options={categoryOptions ?? []}
                            loading={isLoadingCategory}
                            placeholder={"Category"}
                            customClass="w-full "
                            onChange={(e) => {
                              if (e?.label !== STRING_DATA.ALL) {
                                handleDropdownChange("category", e, values)
                                setFieldValue("category", e);
                                return;
                              }
                              setFieldValue("category", getEmptyAllObject());
                              handleDropdownChange("category",e,STRING_DATA.EMPTY);
                            }}
                          />
                        )}
                      </Field>
                    </TextField>
                  </div>
                  <div className={gridElementClass()}>
                    {/* {JSON.stringify(initialValueData?.propertyType)} */}
                    <TextField
                      label={"Asset type"}
                      name={"propertyType"}
                      hasChildren={true}
                    >
                      <Field name="propertyType">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={values?.propertyType}
                            options={assetsTypeOptions ?? []}
                            loading={isLoadingAssetsTypeCategory}
                            placeholder={"Property type"}
                            customClass="w-full "
                            onChange={(e) => {
                              // console.log(e);
                              if (e?.label !== STRING_DATA.ALL) {
                                handleDropdownChange("propertyType", e, values);
                                setFieldValue("propertyType", e);
                                return;
                              }
                              setFieldValue(
                                "propertyType",
                                getEmptyAllObject()
                              );
                              handleDropdownChange("propertyType",e,STRING_DATA.EMPTY);
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
                            defaultValue={values?.location}
                            loading={isLoadingLocation}
                            options={locationOptions}
                            placeholder={"Location"}
                            customClass="w-full "
                            onChange={(e) => {
                              if (e?.label !== STRING_DATA.ALL) {
                                handleDropdownChange("location", e, values);
                                setFieldValue("location", e);
                                return;
                              }
                              setFieldValue("location", null);
                              handleDropdownChange("location",e,STRING_DATA.EMPTY);
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
                            defaultValue={values?.bank}
                            loading={isLoadingBank}
                            options={bankOptions}
                            placeholder={"Banks"}
                            customClass="w-full"
                            onChange={(e: any) => {
                              if (e?.label !== STRING_DATA.ALL) {
                                handleDropdownChange("bank", e, values);
                                setFieldValue("bank", e);
                                return;
                              }
                              setFieldValue("bank", null);
                              handleDropdownChange("bank",e,STRING_DATA.EMPTY);
                            }}
                          />
                        )}
                      </Field>
                    </TextField>
                  </div>
                  <div className={`lg:col-span-4  col-span-full`}>
                    {/* {JSON.stringify(values?.price)} */}
                    <TextField
                      label="Price range"
                      name="price"
                      hasChildren={true}
                    >
                      <Field name="price">
                        {() => (
                          <div className="relative w-full mt-2">
                            <RangeSliderCustom
                              value={values?.price}
                              customClass={"mb-2"}
                              onInput={(value: any, e: any) => {
                                // console.log(value);
                                setFieldValue("price", value);
                                handleDropdownChange("price", value, values);
                              }}
                            />
                            {values?.price?.length ? (
                              <div className="text-black flex items-center gap-4 justify-between">
                                <span className="text-sm text-gray-900">
                                  {formatPrice(values?.price?.[0])}
                                </span>
                                <span className="text-sm text-gray-900">
                                  {formatPrice(values?.price?.[1])}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </TextField>
                  </div>
                </div>
                <div className={gridElementClass()}>
                  <div className="w-full flex items-center justify-end gap-4 flex-wrap">
                    <ActionButton
                      isSubmit={true}
                      text={STRING_DATA.UPDATE.toUpperCase()}
                      isLoading={staticLoading}
                      // customClass={"min-w-[150px]"}
                    />

                    {isMobileView.mobileView ? (
                      <ActionButton
                        text={STRING_DATA.CANCEL.toUpperCase()}
                        onclick={hideModal}
                        isActionButton={false}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </Form>
          )}
        </CustomFormikForm>
      </>
    );
  };

  return (
    <>
      <CustomModal openModal={openModal}>
        <div className="w-full flex flex-col gap-4">
          {renderForm()}
          </div>
      </CustomModal>
      <div className="bg-[#e3e3e3] sticky left-0 right-0 top-0  z-20">
        {renderData()}
      </div>
    </>
  );
};

export default FindAuction;
