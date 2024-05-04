"use client"
import { RANGE_PRICE } from "@/shared/Constants";

// @ts-ignore
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function RangeSliderCustom(props: { value: any; onInput: any; customClass?:string }) {
  const { value, onInput, customClass } = props;
  return (
    <RangeSlider
      placeholder="Enter price"
      value={value ?? [10000000, 500000000]}
      min={RANGE_PRICE.MIN}
      max={RANGE_PRICE.MAX}
      onInput={onInput}
      className={customClass ?? ""}
    />
  );
}
