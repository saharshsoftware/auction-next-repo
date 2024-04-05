"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  CATEGORIES,
  ERROR_MESSAGE,
  RANGE_PRICE,
  REACT_QUERY,
  STRING_DATA,
} from "../../shared/Constants";

import {
  getBankOptions,
  getCategoryOptions,
  getDataFromQueryParams,
  handleQueryResponse,
  selectedBank,
  selectedCategory,
  selectedLocation,
  setDataInQueryParams,
} from "../../shared/Utilies";
import useModal from "../../hooks/useModal";
import CustomModal from "../atoms/CustomModal";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Field, Form } from "formik";
import TextField from "../atoms/TextField";
import ActionButton from "../atoms/ActionButton";
import * as Yup from "yup";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import {
  ItemRenderer,
  NoDataRendererDropdown,
} from "../atoms/NoDataRendererDropdown";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { revalidatePath } from "next/cache";
import {
  fetchBanks,
  fetchLocation,
  getCategoryBoxCollection,
} from "@/server/actions";
import { IBanks, ICategoryCollection, ILocations } from "@/types";

const gridElementClass = () => "lg:col-span-3  col-span-full";
const validationSchema = Yup.object({
  category: Yup.string().trim().required(ERROR_MESSAGE.CATEGORY_REQUIRED),
  location: Yup.string().trim().required(ERROR_MESSAGE.LOCATION_REQUIRED),
  bank: Yup.string().trim().required(ERROR_MESSAGE.BANK_REQUIRED),
  price: Yup.number()
    .required(ERROR_MESSAGE.PRICE_REQUIRED)
    .positive(ERROR_MESSAGE.PRICE_POSITIVE)
    .integer(ERROR_MESSAGE.PRICE_INTEGER),
});

const FindAuction: React.FC = () => {
  const pathname = usePathname();
  const params_search = useSearchParams();
  const router = useRouter();
  const searchParams = new URLSearchParams(params_search);
  const { showModal, openModal, hideModal } = useModal();

  const { data: categoryOptions, isLoading: isLoadingCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollection()) as unknown as ICategoryCollection[];
      return getCategoryOptions(res) ?? [];
    },
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

  const [initialValueData, setInitialValueData] = useState<any>(
    structuredClone(
      getDataFromQueryParams(searchParams.get("q") ?? "") ?? {
        bank: STRING_DATA.EMPTY,
        price: STRING_DATA.EMPTY,
        location: STRING_DATA.EMPTY,
        category: STRING_DATA.EMPTY,
      }
    )
  );

  const [isMobileView, setIsMobileView] = useState({
    mobileView: false,
    isOpenTopbar: false,
  });

  const handleSubmit = (values: any) => {
    const data = setDataInQueryParams(values);
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);
    const path = `${ROUTE_CONSTANTS.AUCTION}?q=${data}`;
    revalidatePath(path, "page");

    // setLoadingUpdate(true);
    // setTimeout(() => {
    //   setLoadingUpdate(false);
    // }, 500);
    // if (pathname !== ROUTE_CONSTANTS.AUCTION) {
    //   router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);
    // }
    hideModal?.();
  };
  const handleResize = () => {
    setIsMobileView((prev) => ({
      ...prev,
      mobileView: window.innerWidth < 1024,
    }));
  };

  useEffect(() => {
    if (searchParams?.get("q")) {
      const updateFormData = structuredClone(
        getDataFromQueryParams(searchParams.get("q") ?? "")
      );
      setInitialValueData(updateFormData);
    }
  }, [searchParams?.get("q")]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderData = () => {
    if (!isMobileView.mobileView) {
      return <div className="common-section p-4">{renderForm()}</div>;
    }
    return (
      <>
        <div className="flex flex-row items-start justify-between gap-4 p-4">
          <div className="flex items-start justify-start gap-4">
            <em>
              <FontAwesomeIcon icon={faArrowLeft} />
            </em>
            <div className="flex flex-col gap-2">
              <p className="line-clamp-1">{initialValueData?.category}</p>
              <p className="line-clamp-1">{initialValueData?.location}</p>
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
            bank: initialValueData?.bank ?? STRING_DATA.EMPTY,
            price: initialValueData?.price ?? STRING_DATA.EMPTY,
            location: initialValueData?.location ?? STRING_DATA.EMPTY,
            category: initialValueData?.category ?? STRING_DATA.EMPTY,
          }}
          handleSubmit={handleSubmit}
          validationSchema={validationSchema}
          wantToUseFormikEvent={true}
        >
          {({ values, setFieldValue }: any) => (
            <Form>
              <div
                className={`flex ${
                  isMobileView.mobileView ? "flex-col" : "flex-row"
                } items-end justify-between gap-4 `}
              >
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
                            defaultValue={selectedCategory(categoryOptions ?? [], initialValueData)}
                            noDataRenderer={NoDataRendererDropdown}
                            itemRenderer={ItemRenderer}
                            options={categoryOptions ?? []}
                            loading={isLoadingCategory}
                            placeholder={"Category"}
                            customClass="w-full "
                            onChange={(e) => {
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
                            defaultValue={selectedLocation(
                              locationOptions ?? [],
                              initialValueData
                            )}
                            loading={isLoadingLocation}
                            options={locationOptions}
                            placeholder={"Location"}
                            customClass="w-full "
                            onChange={(e) => {
                              setFieldValue("location", e?.[0]?.name);
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
                            noDataRenderer={NoDataRendererDropdown}
                            itemRenderer={ItemRenderer}
                            defaultValue={selectedBank(
                              bankOptions ?? [],
                              initialValueData
                            )}
                            loading={isLoadingBank}
                            options={bankOptions}
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
                  <div className={gridElementClass()}>
                    <TextField
                      type="range"
                      name="price"
                      label="Price"
                      value={values.price}
                      placeholder="Enter price"
                      min={RANGE_PRICE.MIN}
                      max={RANGE_PRICE.MAX}
                      customClass={"custom-range-class"}
                    />
                  </div>
                </div>
                <div className={gridElementClass()}>
                  <div className="w-full flex items-center justify-end gap-4 flex-wrap">
                    <ActionButton
                      isSubmit={true}
                      text={STRING_DATA.UPDATE.toUpperCase()}
                      // isLoading={loadingUpdate}
                      customClass={"min-w-[150px]"}
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

  const renderSearchComponent = () => {
    return (
      <CustomFormikForm
        initialValues={{ search: "" }}
        wantToUseFormikEvent={true}
        handleSubmit={(values: any) => console.log(values)}
      >
        {({ values, setFieldValue }: any) => (
          <Form>
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1">
                <TextField
                  type="text"
                  name="search"
                  value={values.search}
                  placeholder="Location or Property name"
                  isSearch={true}
                  customClass={"form-controls-search"}
                />
              </div>
            </div>
          </Form>
        )}
      </CustomFormikForm>
    );
  };
  return (
    <>
      <CustomModal openModal={openModal}>
        <div className="w-full flex flex-col gap-4">{renderForm()}</div>
      </CustomModal>
      <div className="bg-[#e3e3e3] sticky left-0 right-0 top-0  z-20">
        {renderData()}
        {pathname === ROUTE_CONSTANTS.AUCTION ? (
          <div className="common-section bg-white py-4">
            <div className="flex items-center justify-end">
              {renderSearchComponent()}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default FindAuction;
