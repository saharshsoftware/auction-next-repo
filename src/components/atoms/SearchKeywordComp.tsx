import React from "react";
import CustomFormikForm from "./CustomFormikForm";
import { Field, Form } from "formik";
import { FILTER_EMPTY, STRING_DATA } from "@/shared/Constants";
import TextField from "./TextField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import SearchSvg from "../svgIcons/SearchSvg";
import { useFilterStore } from "@/zustandStore/filters";
import { trackSearch } from "@/helpers/SurveyHelper";

const SearchKeywordComp = (props: { handleClick?: () => void }) => {
  const { handleClick = () => {} } = props;
  const { setFilter } = useFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search =
    pathname !== ROUTE_CONSTANTS.SEARCH ? "" : searchParams.get("q");

  const handleKeywordSearch = (values: { keyword: string }) => {
    handleClick?.();

    console.log(values);
    router.push(`${ROUTE_CONSTANTS.SEARCH}?q=${values?.keyword}`);
    setFilter(FILTER_EMPTY);
    trackSearch();
  };

  return (
    <>
      <CustomFormikForm
        initialValues={{ keyword: search ? search : STRING_DATA.EMPTY }}
        handleSubmit={handleKeywordSearch}
        wantToUseFormikEvent={true}
        enableReinitialize={true}
      >
        {({ setFieldValue, values }: any) => (
          <Form>
            <TextField name={"keyword"} hasChildren={true}>
              <Field name="keyword">
                {() => (
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-[0.55rem] pointer-events-none text-base sm:text-sm">
                      <SearchSvg />
                    </div>
                    <input
                      type="text"
                      value={values.keyword}
                      name={"keyword"}
                      className="bg-gray-50 border border-brand-color text-gray-900 sm:text-sm hover:bg-gray-100 block w-full p-2 ps-[2rem] rounded"
                      autoComplete="false"
                      placeholder="Search"
                      onChange={(e) => {
                        setFieldValue("keyword", e.target.value);
                      }}
                    />
                  </div>
                )}
              </Field>
            </TextField>
          </Form>
        )}
      </CustomFormikForm>
    </>
  );
};

export default SearchKeywordComp;
