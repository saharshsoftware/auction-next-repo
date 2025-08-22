"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { use, useEffect, useState } from "react";
import {
  COOKIES,
  FILTER_EMPTY,
  RANGE_PRICE,
  REACT_QUERY,
  STRING_DATA,
} from "../../shared/Constants";

import {
  doesAssetTypeExistInFilteredAssetType,
  formatPrice,
  getDataFromQueryParams,
  handleFilterAssetTypeChange,
  resetFormValues,
  sanitizeReactSelectOptions,
} from "../../shared/Utilies";
import useModal from "../../hooks/useModal";
import CustomModal from "../atoms/CustomModal";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Field, Form } from "formik";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFilter } from "@fortawesome/free-solid-svg-icons";

import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";
import useCustomParamsData from "@/hooks/useCustomParamsData";
import {
  getAssetTypeClient,
  getCategoryBoxCollectionClient,
} from "@/services/auction";
import { fetchBanksClient } from "@/services/bank";
import { fetchLocationClient } from "@/services/location";
import RangeSliderCustom from "../atoms/RangeSliderCustom";
import { useFilterStore } from "@/zustandStore/filters";
import {
  applyFilters,
  fillFilterHelper,
  fillFilterWithBanksAndAssets,
  fillFilterWithBanksAndCategories,
  fillFilterWithCategoriesAndAssets,
  fillFilterWithLocationsAndAssets,
  fillFilterWithLocationsAndBanks,
  fillFilterWithLocationsAndCategories,
} from "@/helpers/RoutingHelper";
import { trackSearch } from "@/helpers/SurveyHelper";
import { SkeletonFilter } from "../skeltons/SkeletonAuctionPage";

const gridElementClass = () => "lg:col-span-2  col-span-full";

interface IFindAuction {
  isCategoryRoute?: boolean;
  isLocationRoute?: boolean;
  isBankRoute?: boolean;
}

const getEmptyAllObject = () => ({
  // id: 0,
  // name: STRING_DATA.ALL,
  value: "",
  label: STRING_DATA.ALL,
});

const mobileViewFilterClass = () =>
  "border bg-white text-sm text-gray-800 shadow px-2 py-1 min-w-fit rounded-lg border-brand-color text-center line-clamp-1";

const FindAuction = (props: IFindAuction) => {
  const filterData = useFilterStore((state) => state.filter);
  const { setFilter } = useFilterStore();
  const [isFilterLoading, setIsFilterLoading] = useState(true);
  const params = useParams() as {
    slug: string;
    slugasset: string;
    slugcategory: string;
    slugbank: string;
  };
  const params_search = useSearchParams();
  const router = useRouter();
  const currentRoute = usePathname();
  const { showModal, openModal, hideModal } = useModal();
  const { setFilter: setAuctionFilter } = useFilterStore();
  const [filteredAssetsType, setFilterAssetsType] = useState<IAssetType[]>([]);

  const { setDataInQueryParamsMethod, getDataFromQueryParamsMethod } =
    useCustomParamsData();
  const { data: categoryOptions, isLoading: isLoadingCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollectionClient()) as unknown as ICategoryCollection[];
      const updatedData = [
        getEmptyAllObject(),
        ...sanitizeReactSelectOptions(res),
      ];
      if (currentRoute.startsWith(ROUTE_CONSTANTS.CATEGORY))
        fillFilter(updatedData);
      return updatedData ?? [];
    },
  });

  const { data: assetsTypeOptions, isLoading: isLoadingAssetsTypeCategory } =
    useQuery({
      queryKey: [REACT_QUERY.ASSETS_TYPE],
      queryFn: async () => {
        const res = (await getAssetTypeClient()) as unknown as IAssetType[];
        const updatedData = [
          getEmptyAllObject(),
          ...sanitizeReactSelectOptions(res),
        ];
        if (currentRoute.startsWith(ROUTE_CONSTANTS.TYPES))
          fillFilter(updatedData);
        return updatedData ?? [];
      },
    });

  const { data: bankOptions, isLoading: isLoadingBank } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanksClient()) as unknown as IBanks[];
      const updatedData = [
        getEmptyAllObject(),
        ...sanitizeReactSelectOptions(res),
      ];
      if (currentRoute.startsWith(ROUTE_CONSTANTS.BANKS))
        fillFilter(updatedData);
      return updatedData ?? [];
    },
  });

  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];
      const responseData = res ?? [];
      const updatedData = [
        getEmptyAllObject(),
        ...sanitizeReactSelectOptions(responseData),
      ];
      if (currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION))
        fillFilter(updatedData);
      return updatedData ?? [];
    },
  });

  // Use useEffect to notify the parent about loading state
  useEffect(() => {
    const isLoading =
      isLoadingCategory ||
      isLoadingAssetsTypeCategory ||
      isLoadingBank ||
      isLoadingLocation;
    setIsFilterLoading(isLoading);
  }, [
    isLoadingCategory,
    isLoadingAssetsTypeCategory,
    isLoadingBank,
    isLoadingLocation,
  ]);

  const [staticLoading, setStaticLoading] = useState(false);

  function handleFilterAssetTypesDropdownData(
    slugcategory: string
  ): IAssetType[] {
    const result = handleFilterAssetTypeChange(
      slugcategory,
      assetsTypeOptions ?? []
    );
    setFilterAssetsType(result);
    return result;
  }

  const [initialValueData, setInitialValueData] = useState<any>({
    propertyType: getEmptyAllObject(),
    bank: getEmptyAllObject(),
    price: STRING_DATA.EMPTY,
    location: getEmptyAllObject(),
    category: getEmptyAllObject(),
  });

  useEffect(() => {
    if (currentRoute.startsWith(ROUTE_CONSTANTS.CATEGORY) && params.slug) {
      handleFilterAssetTypesDropdownData(params.slug);
    }
    applyFilters(
      params,
      currentRoute,
      locationOptions,
      assetsTypeOptions,
      bankOptions,
      categoryOptions,
      fillFilter,
      fillFilterWithTwoSlug
    );
  }, [
    params,
    locationOptions,
    bankOptions,
    assetsTypeOptions,
    categoryOptions,
  ]);

  const fillFilterWithTwoSlug = (slug1List: any, slug2List: any) => {
    const { slug, slugasset, slugcategory, slugbank } = params;
    // console.log("(fillFilterWithTwoSlug)", {
    //   slug,
    //   slugasset,
    //   slugcategory,
    // });

    if (slug && slugasset) {
      if (currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION)) {
        fillFilterWithLocationsAndAssets(
          slug1List, // locations
          slug2List, // asssetTypes
          params,
          filterData,
          setInitialValueData,
          setFilter,
          FILTER_EMPTY
        );
      }

      if (currentRoute.startsWith(ROUTE_CONSTANTS.BANKS)) {
        fillFilterWithBanksAndAssets(
          slug1List, // banks
          slug2List, // asssetTypes
          params,
          filterData,
          setInitialValueData,
          setFilter,
          FILTER_EMPTY
        );
      }

      if (currentRoute.startsWith(ROUTE_CONSTANTS.CATEGORY)) {
        fillFilterWithCategoriesAndAssets(
          slug1List, // categories
          slug2List, // asssetTypes
          params,
          filterData,
          setInitialValueData,
          setFilter,
          FILTER_EMPTY
        );
      }
    } else if (slug && slugcategory) {
      handleFilterAssetTypesDropdownData(slugcategory);
      if (currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION)) {
        fillFilterWithLocationsAndCategories(
          slug1List, // categoryList
          slug2List, // asssetTypes
          params,
          filterData,
          setInitialValueData,
          setFilter,
          FILTER_EMPTY
        );
      }

      if (currentRoute.startsWith(ROUTE_CONSTANTS.BANKS)) {
        fillFilterWithBanksAndCategories(
          slug1List, // categoryList
          slug2List, // asssetTypes
          params,
          filterData,
          setInitialValueData,
          setFilter,
          FILTER_EMPTY
        );
      }
    } else if (slug && slugbank) {
      if (currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION)) {
        fillFilterWithLocationsAndBanks(
          slug1List, // locations
          slug2List, // bankslist
          params,
          filterData,
          setInitialValueData,
          setFilter,
          FILTER_EMPTY
        );
      }
    }
  };

  const fillFilter = (data: any) => {
    fillFilterHelper(
      data,
      currentRoute,
      params,
      filterData,
      setInitialValueData,
      setFilter,
      FILTER_EMPTY
    );
  };

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
      category:
        category?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : category,
      price,
      bank: bank?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : bank,
      locationType: type,
      location:
        location?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : location,
      propertyType:
        propertyType?.label === STRING_DATA.ALL
          ? STRING_DATA.EMPTY
          : propertyType,
    };
    console.log(filter);
    setFilter(filter);
    trackSearch();
    setAuctionFilter(filter);
    const data: any = setDataInQueryParamsMethod(filter);
    // console.log(data)

    // setStaticLoading(true);

    setStaticLoading(true);
    setTimeout(() => {
      setStaticLoading(false);
    }, 1000);
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);

    hideModal?.();
  };

  const handleResize = () => {
    setIsMobileView((prev) => ({
      ...prev,
      mobileView: window.innerWidth < 1024,
    }));
  };

  useEffect(() => {
    if (params_search?.get("q") && currentRoute !== "/search") {
      const updateFormData = JSON.parse(
        JSON.stringify(getDataFromQueryParams(params_search.get("q") ?? ""))
      );
      setFilter(updateFormData);
    }
  }, [params_search?.get("q")]);

  useEffect(() => {
    if (filterData) {
      setInitialValueData({ ...filterData });
    }
  }, [filterData]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const renderFilterTabs = (data: any) => {
    if (data) {
      return <div className={mobileViewFilterClass()}>{data}</div>;
    }
    return null;
  };

  const renderData = () => {
    if (isFilterLoading) {
      return <SkeletonFilter />;
    }
    if (!isMobileView.mobileView) {
      return (
        <div className="common-section p-4  hidden lg:block">
          {renderForm()}
        </div>
      );
    }
    return (
      <>
        <div className="flex flex-row items-start justify-between gap-12 p-4">
          <div className="flex items-start justify-start gap-2">
            <em onClick={handleBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </em>
            <div className="grid grid-cols-2 gap-2">
              {/* {JSON.stringify(initialValueData)} */}
              {renderFilterTabs(initialValueData?.category?.name)}
              {renderFilterTabs(initialValueData?.location?.name)}
              {renderFilterTabs(initialValueData?.bank?.name)}
              {renderFilterTabs(initialValueData?.propertyType?.name)}
              {initialValueData?.price?.length ? (
                <div className={mobileViewFilterClass()}>
                  {formatPrice(initialValueData?.price?.[0])} -{" "}
                  {formatPrice(initialValueData?.price?.[1])}
                </div>
              ) : null}
            </div>
          </div>
          <span className="link primary-link" onClick={showModal}>
            <FontAwesomeIcon icon={faFilter} />
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
                            name="category"
                            customClass="w-full "
                            onChange={(e: IAssetType) => {
                              if (e?.label !== STRING_DATA.ALL) {
                                setFieldValue("category", e);
                                const result =
                                  handleFilterAssetTypesDropdownData(e?.slug);
                                const isFound = result?.length
                                  ? doesAssetTypeExistInFilteredAssetType(
                                      result,
                                      values?.propertyType
                                    )
                                  : true;

                                // console.log("RESULT: ", {
                                //   result,
                                //   propertyType: values?.propertyType,
                                //   isFound,
                                // });
                                if (!isFound) {
                                  resetFormValues(
                                    "propertyType",
                                    setFieldValue,
                                    setAuctionFilter,
                                    filterData
                                  );
                                }
                                return;
                              }
                              setFieldValue("category", getEmptyAllObject());
                              setAuctionFilter({
                                ...filterData,
                                category: STRING_DATA.EMPTY,
                              });
                            }}
                          />
                        )}
                      </Field>
                    </TextField>
                  </div>
                  <div className={gridElementClass()}>
                    {/* {JSON.stringify(initialValueData?.propertyType)} */}
                    <TextField
                      label={"Property type"}
                      name={"propertyType"}
                      hasChildren={true}
                    >
                      <Field name="propertyType">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={values?.propertyType}
                            options={
                              filteredAssetsType?.length
                                ? filteredAssetsType
                                : assetsTypeOptions ?? []
                            }
                            loading={isLoadingAssetsTypeCategory}
                            placeholder={"Property type"}
                            name="propertyType"
                            customClass="w-full "
                            onChange={(e) => {
                              // console.log(e);
                              if (e?.label !== STRING_DATA.ALL) {
                                setFieldValue("propertyType", e);
                                return;
                              }
                              setFieldValue(
                                "propertyType",
                                getEmptyAllObject()
                              );
                              setAuctionFilter({
                                ...filterData,
                                propertyType: STRING_DATA.EMPTY,
                              });
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
                            name="location"
                            customClass="w-full "
                            onChange={(e) => {
                              if (e?.label !== STRING_DATA.ALL) {
                                setFieldValue("location", e);
                                return;
                              }
                              setFieldValue("location", getEmptyAllObject());
                              setAuctionFilter({
                                ...filterData,
                                location: STRING_DATA.EMPTY,
                              });
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
                            name="bank"
                            onChange={(e: any) => {
                              if (e?.label !== STRING_DATA.ALL) {
                                setFieldValue("bank", e);
                                return;
                              }
                              setFieldValue("bank", getEmptyAllObject());
                              setAuctionFilter({
                                ...filterData,
                                bank: STRING_DATA.EMPTY,
                              });
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
                    {isMobileView.mobileView ? (
                      <ActionButton
                        text={STRING_DATA.CANCEL.toUpperCase()}
                        onclick={hideModal}
                        isActionButton={false}
                      />
                    ) : null}

                    <ActionButton
                      isSubmit={true}
                      text={STRING_DATA.UPDATE.toUpperCase()}
                      isLoading={staticLoading}
                      // customClass={"min-w-[150px]"}
                    />
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
        <div className="w-full flex flex-col gap-4">{renderForm()}</div>
      </CustomModal>
      <div className={"bg-[#e3e3e3] sticky left-0 right-0 top-0  z-20"}>
        {renderData()}
      </div>
    </>
  );
};

export default FindAuction;
