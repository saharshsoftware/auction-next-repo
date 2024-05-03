import React from "react";
import type { SVGProps } from "react";

export function WishlistSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.4rem"
      height="1.4rem"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M32 64a8 8 0 0 1 8-8h176a8 8 0 0 1 0 16H40a8 8 0 0 1-8-8m8 72h64a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16m80 48H40a8 8 0 0 0 0 16h80a8 8 0 0 0 0-16m128-40c0 36.52-50.28 62.08-52.42 63.16a8 8 0 0 1-7.16 0C186.28 206.08 136 180.52 136 144a32 32 0 0 1 56-21.14A32 32 0 0 1 248 144m-16 0a16 16 0 0 0-32 0a8 8 0 0 1-16 0a16 16 0 0 0-32 0c0 20.18 26.21 39.14 40 46.93c13.79-7.78 40-26.74 40-46.93"
      ></path>
    </svg>
  );
}
