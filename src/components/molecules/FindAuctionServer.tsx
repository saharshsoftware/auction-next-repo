"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";
import ActionButton from "../atoms/ActionButton";
import MobileFiltersBar from "./MobileFiltersBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faArrowLeft, faSort } from "@fortawesome/free-solid-svg-icons";
import TextField from "../atoms/TextField";
import RangeSliderCustom from "../atoms/RangeSliderCustom";
import { formatPrice, IServiceProviders, SERVICE_PROVIDER_OPTIONS } from "@/shared/Utilies";
import useResize from "@/hooks/useResize";
import {
  COOKIES,
  getEmptyAllObject,
  getEmptyAssetTypeObject,
  RANGE_PRICE,
  STRING_DATA,
} from "@/shared/Constants";
import useModal from "@/hooks/useModal";
import CustomModal from "../atoms/CustomModal";
import useCustomParamsData from "@/hooks/useCustomParamsData";
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import SortModal from "./SortModal";
import { setCookie } from "cookies-next";

interface FindAuctionProps {
  categories: ICategoryCollection[];
  assets: IAssetType[];
  banks: IBanks[];
  locations: ILocations[];
  selectedCategory?: ICategoryCollection;
  selectedAsset?: IAssetType;
  selectedBank?: IBanks;
  selectedLocation?: ILocations;
  selectedPrice?: number[];
  selectedServiceProvider?: IServiceProviders;
}

const gridElementClass = () => "lg:col-span-2  col-span-full";


const FindAuction: React.FC<FindAuctionProps> = ({
  categories,
  assets,
  banks,
  locations,
  selectedCategory = getEmptyAllObject(),
  selectedAsset = getEmptyAllObject(),
  selectedBank = getEmptyAllObject(),
  selectedLocation = getEmptyAllObject(),
  selectedPrice = [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
  selectedServiceProvider = getEmptyAllObject() as IServiceProviders,
}) => {
  const router = useRouter();
  const { setDataInQueryParamsMethod } = useCustomParamsData();
  const { showModal: showFilterModal, openModal, hideModal } = useModal();
  const { showModal: showSortModal, openModal: openSortModal, hideModal: hideSortModal } = useModal();
  const [filteredAssets, setFilteredAssets] = useState<IAssetType[]>(
    assets ?? []
  );

  const [staticLoading, setStaticLoading] = useState(false);
  const { isMobileView } = useResize();

  const [currentFilterValues, setCurrentFilterValues] = useState(() => ({
    category: selectedCategory || getEmptyAllObject(),
    location: selectedLocation || getEmptyAllObject(),
    bank: selectedBank || getEmptyAllObject(),
    propertyType: selectedAsset || getEmptyAllObject(),
    price: selectedPrice || [RANGE_PRICE.MIN, RANGE_PRICE.MAX],
    serviceProvider: selectedServiceProvider || getEmptyAllObject(),
  }));

  // // Function to update filter values immediately for responsive UI
  const updateFilterValue = useCallback((field: string, value: any) => {
    setCurrentFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleBack = () => {
    console.log("Back button clicked");
  };

  const showModal = () => {
    console.log("Filter modal opened");
    showFilterModal();
  };

  const handleSortChange = (sortOption: any) => {
    setCookie(COOKIES.SORT_KEY, sortOption.value);
    router.refresh();
  };

  const removeFilter = (filterType: string) => {
    const currentFilters = {
      category: selectedCategory,
      propertyType: selectedAsset,
      bank: selectedBank,
      location: selectedLocation,
      price: selectedPrice,
      serviceProvider: selectedServiceProvider,
    };

    let updatedFilter: any = {};

    switch (filterType) {
      case 'category':
        updatedFilter = { ...currentFilters, category: getEmptyAllObject() };
        updateFilterValue('category', getEmptyAllObject());
        break;
      case 'propertyType':
        updatedFilter = { ...currentFilters, propertyType: getEmptyAllObject() };
        updateFilterValue('propertyType', getEmptyAllObject());
        break;
      case 'bank':
        updatedFilter = { ...currentFilters, bank: getEmptyAllObject() };
        updateFilterValue('bank', getEmptyAllObject());
        break;
      case 'location':
        updatedFilter = { ...currentFilters, location: getEmptyAllObject() };
        updateFilterValue('location', getEmptyAllObject());
        break;
      case 'price':
        const resetPrice = [Number(RANGE_PRICE.MIN), Number(RANGE_PRICE.MAX)];
        updatedFilter = { ...currentFilters, price: resetPrice };
        updateFilterValue('price', resetPrice);
        break;
      case 'serviceProvider':
        updatedFilter = { ...currentFilters, serviceProvider: getEmptyAllObject() };
        updateFilterValue('serviceProvider', getEmptyAllObject());
        break;
    }

    const { category, price, bank, location, propertyType, serviceProvider } = updatedFilter;
    const { type } = location ?? {};
    const filter = {
      page: 1,
      category: category?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : category,
      price,
      bank: bank?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : bank,
      locationType: type,
      location: location?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : location,
      propertyType: propertyType?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : propertyType,
      serviceProvider: serviceProvider?.label === STRING_DATA.ALL ? STRING_DATA.EMPTY : serviceProvider,
    };

    const data: any = setDataInQueryParamsMethod(filter);
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);
  };


  const handleSubmit = (values: any) => {
    console.log(values, "values123");
    const { category, price, bank, location, propertyType, serviceProvider } = values;
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

      serviceProvider:
        serviceProvider?.label === STRING_DATA.ALL
          ? STRING_DATA.EMPTY
          : serviceProvider,
    };
    //   console.log(filter);
    //   setFilter(filter);
    //   trackSearch();
    //   setAuctionFilter(filter);
    const data: any = setDataInQueryParamsMethod(filter);
    console.log("setDataInQueryParamsMethod-filter", { filter, data });
    if (isMobileView.mobileView) {
      setCurrentFilterValues(filter);
    }
    setStaticLoading(true);
    setTimeout(() => {
      setStaticLoading(false);
    }, 1000);
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);

    hideModal?.();
  };

  const handleCategoryChange = useCallback((
    selectedCategorySlug: string,
    setFieldValue?: any
  ) => {
    setFieldValue?.("propertyType", getEmptyAllObject()); // Reset propertyType

    // If category is "All" or empty, show all assets (assets already contain "All" option)
    if (!selectedCategorySlug || selectedCategorySlug === STRING_DATA.EMPTY) {
      setFilteredAssets(assets);
      return;
    }

    // Filter asset types based on the selected category and add "All" option
    const filteredOptions = assets.filter(
      (item: IAssetType) => item?.category?.slug === selectedCategorySlug
    );

    // Find the existing "All" option from the original assets
    const allOption = assets.find(item => item?.label === STRING_DATA.ALL || (item as any)?.value === STRING_DATA.EMPTY);
    const assetsWithAllOption = allOption
      ? [allOption, ...(filteredOptions?.length > 0 ? filteredOptions : assets.filter(item => item !== allOption))]
      : [getEmptyAssetTypeObject(), ...(filteredOptions?.length > 0 ? filteredOptions : assets)];
    setFilteredAssets(assetsWithAllOption);
  }, [assets]);

  useEffect(() => {
    if ("slug" in selectedCategory && selectedCategory?.slug) {
      handleCategoryChange(selectedCategory?.slug);
    } else if (selectedCategory?.value === STRING_DATA.EMPTY || selectedCategory?.label === STRING_DATA.ALL) {
      // Handle case where category is reset to "All" (assets already contain "All" option)
      setFilteredAssets(assets);
    }
  }, [selectedCategory, assets, handleCategoryChange]);

  const renderForm = () => (
    <Formik
      initialValues={{
        category: selectedCategory,
        propertyType: selectedAsset,
        bank: selectedBank,
        location: selectedLocation,
        price: selectedPrice,
        serviceProvider: selectedServiceProvider,
      }}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div
            className={`flex ${isMobileView.mobileView ? "flex-col" : "flex-row"
              } items-end justify-between gap-4 `}
          >
            <div className="grid gap-4 grid-cols-12 w-full ">
              <div className={gridElementClass()}>
                <TextField label="Categories" name="category" hasChildren>
                  <Field name="category">
                    {() => (
                      <ReactSelectDropdown
                        name="category"
                        options={categories}
                        placeholder={"Category"}
                        defaultValue={values.category}
                        onChange={(value) => {
                          setFieldValue("category", value);
                          // Handle "All" selection or specific category selection
                          if (value?.value === STRING_DATA.EMPTY || value?.label === STRING_DATA.ALL) {
                            handleCategoryChange(STRING_DATA.EMPTY, setFieldValue);
                          } else {
                            handleCategoryChange(value?.slug, setFieldValue);
                          }
                        }}
                      />
                    )}
                  </Field>
                </TextField>
              </div>
              <div className={gridElementClass()}>
                <TextField label="Property Type" name="propertyType" hasChildren>
                  <Field name="propertyType">
                    {() => (
                      <ReactSelectDropdown
                        name="propertyType"
                        options={filteredAssets}
                        placeholder={"Property Type"}
                        defaultValue={values.propertyType}
                        onChange={(value) =>
                          setFieldValue("propertyType", value)
                        }
                      />
                    )}
                  </Field>
                </TextField>
              </div>
              <div className={gridElementClass()}>
                <TextField
                  label="Location (City & State)"
                  name="location"
                  hasChildren
                >
                  <Field name="location">
                    {() => (
                      <ReactSelectDropdown
                        name="location"
                        options={locations}
                        placeholder={"Location"}
                        defaultValue={values.location}
                        onChange={(value) => setFieldValue("location", value)}
                      />
                    )}
                  </Field>
                </TextField>
              </div>
              <div className={gridElementClass()}>
                <TextField label="Bank" name="bank" hasChildren>
                  <Field name="bank">
                    {() => (
                      <ReactSelectDropdown
                        name="bank"
                        options={banks}
                        placeholder={"Bank"}
                        defaultValue={values.bank}
                        onChange={(value) => setFieldValue("bank", value)}
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
              <div className={`lg:col-span-4  col-span-full`}>
                <TextField label="Price range" name="price" hasChildren>
                  <Field name="price">
                    {() => (
                      <div className="relative w-full mt-2">
                        <RangeSliderCustom
                          value={values?.price}
                          customClass="mb-2"
                          onInput={(value: any) =>
                            setFieldValue("price", value)
                          }
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
                //   customClass={"min-w-[150px]"}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  const renderData = () => {
    if (!isMobileView.mobileView) {
      return (
        <div className="common-section p-4 hidden lg:block">{renderForm()}</div>
      );
    }

    return (
      <>
        <MobileFiltersBar
          filterData={{
            category: currentFilterValues?.category,
            location: currentFilterValues?.location,
            bank: currentFilterValues?.bank,
            propertyType: currentFilterValues?.propertyType,
            price: currentFilterValues?.price,
          }}
          onShowModal={showModal}
          onRemoveFilter={removeFilter}
          onShowSortModal={showSortModal}
          onSortChange={handleSortChange}
        />
      </>
    );
  };

  return (
    <>
      <SortModal onSortChange={handleSortChange} openModal={openSortModal} hideModal={hideSortModal} />
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
