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
  capitalizeFirstLetter,
  getBankOptions,
  getDataFromQueryParams,
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
import { useParams, useRouter } from "next/navigation";
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
import useCustomParamsData from "@/hooks/useCustomParamsData";
import useFindUrl from "@/hooks/useFindUrl";
import { getCategoryBoxCollectionClient } from "@/services/auction";

const gridElementClass = () => "lg:col-span-3  col-span-full";
const validationSchema = Yup.object({
  category: Yup.string().trim(),
  location: Yup.string().trim(),
  bank: Yup.string().trim(),
  price: Yup.number()
    
    .positive(ERROR_MESSAGE.PRICE_POSITIVE)
    .integer(ERROR_MESSAGE.PRICE_INTEGER),
});

interface IFindAuction {
  isCategoryRoute?: boolean;
  isLocationRoute?: boolean;
  isBankRoute?: boolean;
}

const FindAuction = (props: IFindAuction) => {
  const {isBankRoute=false, isCategoryRoute=false, isLocationRoute=false} = props;
  const { findUrl, bankRoute, categoryRoute, locationRoute } = useFindUrl();
  const params = useParams()
  const params_search = useSearchParams();
  const router = useRouter();
  const currentRoute = usePathname();
  const { showModal, openModal, hideModal } = useModal();
  const { setDataInQueryParamsMethod, getDataFromQueryParamsMethod } =
    useCustomParamsData();
  const { data: categoryOptions, isLoading: isLoadingCategory ,refetch:refetchCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollectionClient()) as unknown as ICategoryCollection[];
      console.log(
        res,
        currentRoute.startsWith("/category"),
      );
      const updatedData = [{ id: 0, name: STRING_DATA.ALL }, ...res];
      if (currentRoute.startsWith("/category")) fillFilter(updatedData);
      return updatedData ?? [];
    },
  });

  const { data: bankOptions, isLoading: isLoadingBank, refetch:refetchBank } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanks()) as unknown as IBanks[];
      const responseData = getBankOptions(res) ?? [];
      const updatedData = [{ id: 0, name: STRING_DATA.ALL }, ...responseData];
      if (currentRoute.startsWith("/bank")) fillFilter(updatedData);
      return updatedData ?? [];
    },
  });

  const { data: locationOptions, isLoading: isLoadingLocation, refetch:refetchLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocation()) as unknown as ILocations[];
      const responseData = res ?? [];
      const updatedData = [{ id: 0, name: STRING_DATA.ALL }, ...responseData];
      if (currentRoute.startsWith("/location")) fillFilter(updatedData);
      return updatedData ?? [];
    },
  });

  const [staticLoading, setStaticLoading] = useState(false);

  const [initialValueData, setInitialValueData] = useState<any>(
    structuredClone(
      getDataFromQueryParams(params_search.get("q") ?? "") ?? {
        bank: STRING_DATA.EMPTY,
        price: STRING_DATA.EMPTY,
        location: STRING_DATA.EMPTY,
        category: STRING_DATA.EMPTY,
      }
    )
  );

  useEffect(()=> {
    if (params?.slug) {
      if (currentRoute.startsWith("/category")) {
        refetchCategory();
        return;
      }
      if (currentRoute.startsWith("/bank")) {
        refetchBank();
        return;
      }
      if (currentRoute.startsWith("/location")) {
        refetchLocation();
        return;
      }
    }
  }, [params?.slug])

  const fillFilter = (data: any) =>{
    if (currentRoute.startsWith("/category")) {
      const selectedOne = data.find((item: any) => item?.slug === params?.slug);
      console.log(selectedOne, "selectedOne");
      setInitialValueData({
        category: selectedOne?.name ?? "",
      });
    }
    if (currentRoute.startsWith("/location")) {
      const selectedOne = data.find((item: any) => item?.slug === params?.slug);
      console.log(selectedOne, "selectedOne");
      setInitialValueData({
        location: selectedOne?.name ?? "",
      });
    }
    if (currentRoute.startsWith("/bank")) {
      const selectedOne = data.find((item: any) => item?.slug === params?.slug);
      console.log(selectedOne, "selectedOne");
      setInitialValueData({
        bank: selectedOne?.name ?? "",
      });
    }
  }

  const [isMobileView, setIsMobileView] = useState({
    mobileView: false,
    isOpenTopbar: false,
  });

  const handleSubmit = (values: any) => {
    console.log(values, "values123");
    const data = setDataInQueryParamsMethod({ page: 1, ...values });
    // console.log(data)

    // setStaticLoading(true);

    setStaticLoading(true);
    setTimeout(() => {
      setStaticLoading(false);
    }, 1000);
    
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);
    const path = `${ROUTE_CONSTANTS.AUCTION}?q=${data}`;
    
    // revalidatePath(path, "page");

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
    if (params_search?.get("q")) {
      const updateFormData = structuredClone(
        getDataFromQueryParams(params_search.get("q") ?? "")
      );
      setInitialValueData(updateFormData);
    }
  }, [params_search?.get("q")]);

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
                  {/* {JSON.stringify(values.category)} */}
                  <div className={gridElementClass()}>
                    <TextField
                      label={"Categories"}
                      name={"category"}
                      hasChildren={true}
                    >
                      <Field name="category">
                        {() => (
                          <ReactSelectDropdown
                            defaultValue={selectedCategory(
                              categoryOptions ?? [],
                              initialValueData?.category
                                ? initialValueData
                                : { category: STRING_DATA.ALL }
                            )}
                            noDataRenderer={NoDataRendererDropdown}
                            itemRenderer={ItemRenderer}
                            options={categoryOptions ?? []}
                            loading={isLoadingCategory}
                            placeholder={"Category"}
                            customClass="w-full "
                            onChange={(e) => {
                              if (e?.[0]?.name !== STRING_DATA.ALL) {
                                setFieldValue("category", e?.[0]?.name);
                                return;
                              }
                              setFieldValue("category", "");
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
                              initialValueData?.location
                                ? initialValueData
                                : { location: STRING_DATA.ALL }
                            )}
                            loading={isLoadingLocation}
                            options={locationOptions}
                            placeholder={"Location"}
                            customClass="w-full "
                            onChange={(e) => {
                              if (e?.[0]?.name !== STRING_DATA.ALL) {
                                setFieldValue("location", e?.[0]?.name);
                                return;
                              }
                              setFieldValue("location", "");
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
                              initialValueData?.bank
                                ? initialValueData
                                : { bank: STRING_DATA.ALL }
                            )}
                            loading={isLoadingBank}
                            options={bankOptions}
                            placeholder={"Banks"}
                            customClass="w-full "
                            onChange={(e: any) => {
                              if (e?.[0]?.name !== STRING_DATA.ALL) {
                                setFieldValue("bank", e?.[0]?.name);
                                return;
                              }
                              setFieldValue("bank", "");
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
                      isLoading={staticLoading}
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

  return (
    <>
      <CustomModal openModal={openModal}>
        <div className="w-full flex flex-col gap-4">{renderForm()}</div>
      </CustomModal>
      <div className="bg-[#e3e3e3] sticky left-0 right-0 top-0  z-20">
        {renderData()}
      </div>
    </>
  );
};

export default FindAuction;
