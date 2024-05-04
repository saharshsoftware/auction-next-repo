"use client"
import React from "react";
import Select from "react-select";
import { IReactSelectDropdown } from "../../interfaces/ReactDropdown";

const ReactSelectDropdown: React.FC<IReactSelectDropdown> = (props) => {
  const {
    options,
    loading,
    noDataRenderer,
    itemRenderer,
    customClass,
    name = "",
    onChange = () => {},
    placeholder,
    defaultValue,
    clearRenderer,
    clearable = false,
    menuIsOpen=false,
  } = props;

  return (
    <>
      <div className="w-full text-left ">
        <Select
          // multi={false}
          // className={`custom-select-dropdown ${customClass ?? ""}`}
          className="react-select-container"
          options={options}
          isLoading={loading}
          isDisabled={loading}
          // searchBy="name"
          name={name}
          // labelField="name"
          // valueField="id"
          isSearchable={true}
          isClearable={clearable}
          // defaultValue={defaultValue}
          value={defaultValue ?? null}
          // dropdownHandle={false}
          // menuIsOpen={menuIsOpen}
          onChange={onChange}
          placeholder={placeholder}
          // noDataRenderer={noDataRenderer}
          // itemRenderer={itemRenderer}
          // clearRenderer={clearRenderer}
          classNamePrefix={`${"react-select"}`}
        />
      </div>
    </>
  );
};

export default ReactSelectDropdown;
