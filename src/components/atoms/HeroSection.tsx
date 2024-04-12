"use client"
import React from "react";
import dynamic from "next/dynamic";
// const HeroSearchBox = dynamic(() => import("./HeroSearchBox"), {
//   ssr: false,
// });

import waveImage from "@/assets/wave.svg";
import { STRING_DATA } from "../../shared/Constants";
import { IBanks, ILocations } from "@/types";
import HeroSearchBox from "./HeroSearchBox";

const HeroSection = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${waveImage?.src})`,
      }}
    >
      <div className="bg-opacity-60"></div>
      <div className=" text-center text-neutral-content lg:w-[920px] md:w-[720px] w-11/12">
        <div className="w-full">
          <h2 className="custom-h2-class lg:text-[4vh] text-lg font-bold text-white  mb-4">
            {STRING_DATA.TAG_LINE}
          </h2>
          <HeroSearchBox />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
