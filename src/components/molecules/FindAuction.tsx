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
  getDataFromQueryParams,
  handleQueryResponse,
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
import { fetchCountryData } from "../../services/landingPage";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
  const { data: countriesData, isLoading } = useQuery({
    queryKey: [REACT_QUERY.COUNTRIES],
    queryFn: async () => {
      const res = await fetchCountryData();
      return handleQueryResponse(res);
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
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
    setLoadingUpdate(true);
    const data = setDataInQueryParams(values);
    setTimeout(() => {
      setLoadingUpdate(false);
    }, 500);
    if (pathname !== ROUTE_CONSTANTS.AUCTION) {
      router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);
    }
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

  const getSelectedCategory = () => {
    return [
      CATEGORIES?.find((item) => item?.name === initialValueData?.category),
    ];
  };

  const getSelectedLocation = () => {
    const country = countriesData as any;
    if (country?.length) {
      return [
        country?.find((item: any) => item?.name === initialValueData?.location),
      ];
    }
    return [];
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
                            defaultValue={getSelectedCategory()}
                            noDataRenderer={NoDataRendererDropdown}
                            itemRenderer={ItemRenderer}
                            options={CATEGORIES}
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
                            defaultValue={getSelectedLocation()}
                            loading={isLoading}
                            options={countriesData}
                            placeholder={"Neighborhood, City or State"}
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
                    <TextField
                      type="text"
                      name="bank"
                      label="Bank"
                      value={values.bank}
                      placeholder="Enter bank"
                    />
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
                      isLoading={loadingUpdate}
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
        <div className="common-section bg-white py-4">
          <div className="flex items-center justify-end">
            {renderSearchComponent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default FindAuction;
