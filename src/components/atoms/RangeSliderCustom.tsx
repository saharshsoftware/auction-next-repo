"use client"
import { RANGE_PRICE } from "@/shared/Constants";

// @ts-ignore
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function RangeSliderCustom(props: { value: any; onInput: any; customClass?:string }) {
  const { value, onInput, customClass } = props;
  return (
    <RangeSlider
      value={value ?? [RANGE_PRICE.MIN, RANGE_PRICE.MAX]}
      min={RANGE_PRICE.MIN}
      max={RANGE_PRICE.MAX}
      onInput={onInput}
      className={customClass ?? ""}
    />
  );
}
