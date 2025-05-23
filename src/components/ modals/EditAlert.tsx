import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import {
  ERROR_MESSAGE,
  RANGE_PRICE,
  REACT_QUERY,
  STRING_DATA,
} from "@/shared/Constants";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formatPrice,
  handleOnSettled,
  sanitizeReactSelectOptions,
} from "@/shared/Utilies";
import { updateAlert } from "@/services/auction";
import { Field, Form } from "formik";
import ReactSelectDropdown from "../atoms/ReactSelectDropdown";
import {
  createAlertSearch,
  getAssetTypeClient,
  getCategoryBoxCollectionClient,
} from "@/services/auction";
import {
  IAlert,
  IAssetType,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { fetchBanksClient } from "@/services/bank";
import { fetchLocationClient } from "@/services/location";
import RangeSliderCustom from "../atoms/RangeSliderCustom";

interface ICreateFavList {
  openModal: boolean;
  fieldata: any;
  hideModal?: () => void;
  deleteLoading?: boolean;
  deleteAction?: () => void;
}

const gridElementClass = () => "col-span-full";

const getEmptyAllObject = () => ({
  value: "",
  label: "All",
});

const validationSchema = Yup.object({
  name: Yup.string().trim().required(ERROR_MESSAGE.NAME_REQUIRED),
  location: Yup.object().required(ERROR_MESSAGE.LOCATION_REQUIRED),
  category: Yup.object().required(ERROR_MESSAGE.CATEGORY_REQUIRED),
  propertyType: Yup.object().required(ERROR_MESSAGE.ASSET_TYPE_REQ),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
};

const EditAlert = (props: ICreateFavList) => {
  const {
    openModal,
    hideModal = () => {},
    fieldata,
    deleteAction,
    deleteLoading,
  } = props;
  const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");
  const { data: categoryOptions, isLoading: isLoadingCategory } = useQuery({
    queryKey: [REACT_QUERY.CATEGORY_BOX_COLLECITON_OPTIONS],
    queryFn: async () => {
      const res =
        (await getCategoryBoxCollectionClient()) as unknown as ICategoryCollection[];
      const updatedData = [...sanitizeReactSelectOptions(res)];
      return updatedData ?? [];
    },
  });

  const { data: assetsTypeOptions, isLoading: isLoadingAssetsTypeCategory } =
    useQuery({
      queryKey: [REACT_QUERY.ASSETS_TYPE],
      queryFn: async () => {
        const res = (await getAssetTypeClient()) as unknown as IAssetType[];
        const updatedData = [...sanitizeReactSelectOptions(res)];
        return updatedData ?? [];
      },
    });

  const { data: bankOptions, isLoading: isLoadingBank } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_BANKS],
    queryFn: async () => {
      const res = (await fetchBanksClient()) as unknown as IBanks[];
      const updatedData = [...sanitizeReactSelectOptions(res)];
      return updatedData ?? [];
    },
  });

  const { data: locationOptions, isLoading: isLoadingLocation } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_LOCATION],
    queryFn: async () => {
      const res = (await fetchLocationClient()) as unknown as ILocations[];
      const responseData = res ?? [];
      const updatedData = [...sanitizeReactSelectOptions(responseData)];
      return updatedData ?? [];
    },
  });

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: updateAlert,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [REACT_QUERY.ALERTS],
          });
          // router.push(ROUTE_CONSTANTS.DASHBOARD);
          hideModal?.();
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const handleFavlist = (values: {
    name: string;
    location: ILocations;
    propertyType: IAssetType;
    category: ICategoryCollection;
    bank: IBanks;
    price: any;
  }) => {
    const { location, name, propertyType, category, bank, price } = values;
    const body = {
      name,
      location: location?.name ?? "",
      assetType: propertyType?.name ?? "",
      assetCategory: category?.name ?? "",
      bankName: bank?.name ?? "",
      minPrice: price?.[0],
      maxPrice: price?.[1],
      locationType: location?.type ?? "",
    };

    const payload = {
      body,
      id: fieldata?.id,
    };
    console.log(payload);
    mutate(payload);
  };

  const renderSeletedOption = (field: any, key: string) => {
    const result = { label: field[key], value: field[key], name: field[key] };
    return result;
  };
  return (
    <>
      <CustomModal
        openModal={openModal}
        modalHeading={STRING_DATA.EDIT_ALERT}
        customWidthClass="md:w-[40%] sm:w-3/5 w-11/12"
      >
        <div className="w-full">
          <div className="flex flex-col gap-4 w-full">
            <CustomFormikForm
              initialValues={{
                name: fieldata?.name,
                category: fieldata?.assetCategory
                  ? renderSeletedOption(fieldata, "assetCategory")
                  : STRING_DATA.EMPTY,
                propertyType: fieldata?.assetType
                  ? renderSeletedOption(fieldata, "assetType")
                  : STRING_DATA.EMPTY,
                location: fieldata?.location
                  ? renderSeletedOption(fieldata, "location")
                  : STRING_DATA.EMPTY,
                bank: fieldata?.bankName
                  ? renderSeletedOption(fieldata, "bankName")
                  : STRING_DATA.EMPTY,
                price:
                  fieldata?.minPrice || fieldata?.maxPrice
                    ? [fieldata?.minPrice, fieldata?.maxPrice]
                    : [0, RANGE_PRICE.MAX],
              }}
              validationSchema={validationSchema}
              handleSubmit={handleFavlist}
              wantToUseFormikEvent={true}
              enableReinitialize={true}
            >
              {({ values, setFieldValue }: any) => (
                <Form>
                  <div
                    className={`flex flex-col items-end justify-between gap-4 `}
                  >
                    {/* {JSON.stringify(values)} */}
                    <div className="grid gap-4 grid-cols-12 w-full ">
                      <div className={gridElementClass()}>
                        <TextField
                          value={values?.name}
                          type="text"
                          name="name"
                          label="Alert name"
                          placeholder="Enter alert name"
                        />
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
                                defaultValue={values?.category}
                                options={categoryOptions ?? []}
                                loading={isLoadingCategory}
                                name="category-edit-alert"
                                placeholder={"Category"}
                                customClass="w-full "
                                onChange={(e) => {
                                  if (e?.label !== STRING_DATA.ALL) {
                                    setFieldValue("category", e);
                                    return;
                                  }
                                  setFieldValue(
                                    "category",
                                    getEmptyAllObject()
                                  );
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
                                defaultValue={values?.propertyType}
                                options={assetsTypeOptions ?? []}
                                loading={isLoadingAssetsTypeCategory}
                                placeholder={"Asset type"}
                                name="asset-type-edit-alert"
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
                              <>
                                <ReactSelectDropdown
                                  defaultValue={values?.location}
                                  loading={isLoadingLocation}
                                  options={locationOptions}
                                  name="location-edit-alert"
                                  placeholder={"Location"}
                                  customClass="w-full "
                                  onChange={(e) => {
                                    if (e?.label !== STRING_DATA.ALL) {
                                      setFieldValue("location", e);
                                      return;
                                    }
                                    setFieldValue("location", null);
                                  }}
                                />
                              </>
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
                                name="bank-edit-alert"
                                customClass="w-full"
                                onChange={(e: any) => {
                                  if (e?.label !== STRING_DATA.ALL) {
                                    setFieldValue("bank", e);
                                    return;
                                  }
                                  setFieldValue("bank", null);
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
                    </div>
                    <div className={gridElementClass()}>
                      <div className="w-full flex items-center justify-end gap-4 flex-wrap">
                        <ActionButton
                          text={STRING_DATA.CANCEL.toUpperCase()}
                          onclick={hideModal}
                          isActionButton={false}
                        />

                        <ActionButton
                          isSubmit={true}
                          text={STRING_DATA.UPDATE.toUpperCase()}
                          isLoading={isPending}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </CustomFormikForm>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default EditAlert;
