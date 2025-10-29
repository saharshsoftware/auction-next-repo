"use client";
import React, { useMemo } from "react";
import ReactSelectDropdown from "./ReactSelectDropdown";
import { BUDGET_RANGES } from "@/shared/Constants";
import { budgetRangesToStrings, stringsToBudgetRanges } from "@/shared/Utilies";
import { BudgetRangeObject } from "@/types";

/**
 * BudgetRangesSelect renders a multi-select for choosing predefined budget ranges.
 * It converts between the UI's string values and the internal { min, max } objects.
 */
interface BudgetRangesSelectProps {
  name: string;
  value: BudgetRangeObject[];
  onChange: (value: BudgetRangeObject[]) => void;
  placeholder?: string;
  customClass?: string;
  isDisabled?: boolean;
}

const BudgetRangesSelect: React.FC<BudgetRangesSelectProps> = (props) => {
  const {
    name,
    value,
    onChange,
    placeholder = "Select budget ranges",
    customClass = "",
    isDisabled = false,
  } = props;

  const budgetOptions: { label: string; value: string }[] = useMemo(
    () => BUDGET_RANGES.map((b) => ({ label: b.label, value: `${b.min}-${b.max}` })),
    []
  );

  const selectedValues = useMemo(() => budgetRangesToStrings(value), [value]);

  const selectedOptions = useMemo(
    () => budgetOptions.filter((opt) => selectedValues.includes(opt.value)),
    [budgetOptions, selectedValues]
  );

  const handleChange = (selected: Array<{ value: string }> | null) => {
    const values = Array.isArray(selected) ? selected.map((o) => o.value) : [];
    onChange(stringsToBudgetRanges(values));
  };

  return (
    <ReactSelectDropdown
      value={selectedOptions}
      options={budgetOptions}
      placeholder={placeholder}
      name={name}
      customClass={customClass}
      isMulti={true}
      hidePlaceholder={true}
      isSearchable={false}
      onChange={handleChange as unknown as (v: any) => void}
      loading={false}
    />
  );
};

export default BudgetRangesSelect;


