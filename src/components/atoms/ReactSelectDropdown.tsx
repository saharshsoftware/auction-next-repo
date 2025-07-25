"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { IReactSelectDropdown } from "../../interfaces/ReactDropdown";

const ReactSelectDropdown: React.FC<IReactSelectDropdown> = (props) => {
  const {
    options,
    loading,
    name = "",
    onChange = () => {},
    placeholder,
    defaultValue,
    clearable = false,
    isMulti = false,
    hidePlaceholder = false,
    maxMultiSelectOptions = 5,
    isSearchable = true,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted && !hidePlaceholder) {
    return (
      <div className="w-full min-h-[38px] border border-brand-color rounded px-3 flex items-center justify-between bg-white">
        <span className="">All</span>
        <div className="flex items-center h-[20px]">
          {/* Ensure it's block */}
          <span>
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
              fill="#ccc"
              className="w-5 h-5"
            >
              <path
                fill="#ccc"
                d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    );
  }

  const handleChange = (selectedOption: any) => {
    if (isMulti) {
      if (
        Array.isArray(selectedOption) &&
        selectedOption.length > maxMultiSelectOptions
      ) {
        // Prevent selecting more than 5 items
        return;
      }
    }
    onChange(selectedOption);
  };

  return (
    <>
      <div
        id={`container-react-select-${name ?? ""}`}
        className="w-full text-left"
      >
        <Select
          className="react-select-container"
          id={`react-select-${name ?? ""}`}
          aria-label={name}
          options={options}
          isLoading={loading}
          isMulti={isMulti}
          isDisabled={loading}
          name={name}
          isSearchable={isSearchable}
          isClearable={clearable}
          value={defaultValue ?? null}
          onChange={handleChange}
          placeholder={placeholder}
          classNamePrefix="react-select"
        />
      </div>
    </>
  );
};

export default ReactSelectDropdown;
