"use client";
import React, { useEffect, useRef, useState } from "react";
import CustomFormikForm from "./CustomFormikForm";
import { Field, Form } from "formik";
import { FILTER_EMPTY, STRING_DATA } from "@/shared/Constants";
import TextField from "./TextField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import SearchSvg from "../svgIcons/SearchSvg";
import { useFilterStore } from "@/zustandStore/filters";
import { trackSearch } from "@/helpers/SurveyHelper";
import ClockSvg from "../svgIcons/ClockSvg";

const RECENT_KEY = "recent_searches";

const SearchKeywordComp = ({ handleClick = () => {} }) => {
  const { setFilter } = useFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search =
    pathname !== ROUTE_CONSTANTS.SEARCH ? "" : searchParams.get("q");

  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const updateRecentSearches = (keyword: string) => {
    let items = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    items = [
      keyword,
      ...items.filter((item: string) => item !== keyword),
    ].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
    setRecentSearches(items);
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    setRecentSearches(items);
  }, []);

  const handleKeywordSearch = (values: { keyword: string }) => {
    handleClick?.();
    updateRecentSearches(values.keyword);
    router.push(`${ROUTE_CONSTANTS.SEARCH}?q=${values?.keyword}&page=1`);
    setFilter(FILTER_EMPTY);
    trackSearch();
    setShowDropdown(false);
  };

  const wrapperRef = useRef<any>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <CustomFormikForm
        initialValues={{ keyword: search || STRING_DATA.EMPTY }}
        handleSubmit={handleKeywordSearch}
        wantToUseFormikEvent={true}
        enableReinitialize={true}
      >
        {({ setFieldValue, values, submitForm }: any) => (
          <Form autoComplete="off">
            <TextField name="keyword" hasChildren>
              <Field name="keyword">
                {() => (
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-[0.55rem] pointer-events-none text-base sm:text-sm">
                      <SearchSvg />
                    </div>
                    <input
                      type="text"
                      value={values.keyword}
                      name="keyword"
                      className="bg-gray-50 border border-brand-color text-gray-900 sm:text-sm hover:bg-gray-100 block w-full p-2 ps-[2rem] rounded"
                      placeholder="Search"
                      onFocus={() => setShowDropdown(true)}
                      onChange={(e) => {
                        setFieldValue("keyword", e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          submitForm();
                        }
                      }}
                    />
                    {showDropdown && recentSearches.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-sm">
                        {recentSearches.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <div
                              className="flex items-center gap-2"
                              onClick={() => {
                                setFieldValue("keyword", item);
                                submitForm();
                              }}
                            >
                              {/* Clock icon */}
                              <ClockSvg />
                              <span className="font-semibold text-sm text-black">
                                {item}
                              </span>
                            </div>

                            {/* Clear (X) icon */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = recentSearches.filter(
                                  (_, i) => i !== idx
                                );
                                setRecentSearches(updated);
                                localStorage.setItem(
                                  RECENT_KEY,
                                  JSON.stringify(updated)
                                );
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500 hover:text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Field>
            </TextField>
          </Form>
        )}
      </CustomFormikForm>
    </div>
  );
};

export default SearchKeywordComp;
