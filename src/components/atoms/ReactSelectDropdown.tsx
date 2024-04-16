import React from "react";
import Select from "react-dropdown-select";
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
    clearable=false,
  } = props;

  return (
    <>
      <div style={{ width: "100%" }}>
        <Select
          multi={false}
          className={`custom-select-dropdown ${customClass ?? ""}`}
          options={options}
          loading={loading}
          disabled={loading}
          searchBy="name"
          name={name}
          labelField="name"
          valueField="id"
          searchable={true}
          clearable={clearable}
          values={defaultValue ?? []}
          dropdownHandle={false}
          onChange={onChange}
          placeholder={placeholder}
          noDataRenderer={noDataRenderer}
          itemRenderer={itemRenderer}
          clearRenderer={clearRenderer}
        />
      </div>
    </>
  );
};

export default ReactSelectDropdown;
