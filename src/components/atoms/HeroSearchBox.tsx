import React, { useState } from "react";
import ActionButton from "./ActionButton";
import CustomBadge from "./CustomBadge";
import ReactSelectDropdown from "./ReactSelectDropdown";
import { Field, Form } from "formik";
import CustomFormikForm from "./CustomFormikForm";
import TextField from "./TextField";
import {
  CATEGORIES,
  ERROR_MESSAGE,
  POPULER_CITIES,
  RANGE_PRICE,
  REACT_QUERY,
  STRING_DATA,
} from "../../shared/Constants";
import * as Yup from "yup";
import { ROUTE_CONSTANTS } from "../../shared/Routes";
import { ItemRenderer, NoDataRendererDropdown } from "./NoDataRendererDropdown";
import {
  handleQueryResponse,
  setDataInQueryParams,
} from "../../shared/Utilies";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchCountryData } from "@/services/landingPage";

const validationSchema = Yup.object({
  category: Yup.string().trim().required(ERROR_MESSAGE.CATEGORY_REQUIRED),
  location: Yup.string().trim().required(ERROR_MESSAGE.LOCATION_REQUIRED),
  bank: Yup.string().trim().required(ERROR_MESSAGE.BANK_REQUIRED),
  price: Yup.number()
    .required(ERROR_MESSAGE.PRICE_REQUIRED)
    .integer(ERROR_MESSAGE.PRICE_INTEGER)
    .positive(ERROR_MESSAGE.PRICE_POSITIVE),
});

const initialValues = {
  category: STRING_DATA.EMPTY,
  location: STRING_DATA.EMPTY,
  bank: STRING_DATA.EMPTY,
  price: "5000" || STRING_DATA.EMPTY,
};

const gridElementClass = () => "lg:col-span-6 col-span-full";

const HeroSearchBox: React.FC = () => {
  const router = useRouter();
  const [activeBadgeData, setActiveBadgeData] = useState(POPULER_CITIES?.[0]);
  const { data: dataF, isLoading } = useQuery({
    queryKey: [REACT_QUERY.COUNTRIES],
    queryFn: async () => {
      const res = await fetchCountryData();
      return handleQueryResponse(res);
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const handleSubmit = (values: any) => {
    const data = setDataInQueryParams(values);
    router.push(`${ROUTE_CONSTANTS.AUCTION}?q=${data}`);
  };

  const handleBadgeClick = (data: any) => {
    setActiveBadgeData(data);
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
                          options={CATEGORIES}
                          placeholder={"Category"}
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
                          loading={isLoading}
                          options={dataF}
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
                  <TextField
                    type="text"
                    name="bank"
                    label="Bank"
                    placeholder="Enter bank"
                  />
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
                    customClass={"custom-range-class"}
                  />
                </div>

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <ActionButton
                    isSubmit={true}
                    text={STRING_DATA.SEARCH.toUpperCase()}
                    customClass={"rounded-full btn-lg px-12 py-4 "}
                  />
                </div>
              </div>
            </Form>
          )}
        </CustomFormikForm>
        <label className="block text-sm font-medium text-gray-900 text-left">
          {STRING_DATA.POPULER_CITIES}
        </label>
        <div className="flex flex-wrap gap-2">
          {POPULER_CITIES.map((item, index) => (
            <CustomBadge
              key={index}
              item={item}
              activeBadge={activeBadgeData}
              onclick={handleBadgeClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroSearchBox;
