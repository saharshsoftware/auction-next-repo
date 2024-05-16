import React from "react";

import waveImage from "@/assets/wave.svg";
import auctionbg from "@/assets/images/auctionbg.jpg";
import { STRING_DATA } from "../../shared/Constants";
import HeroSearchBox from "./HeroSearchBox";

const HeroSection = (props: {
  assetsTypeOptions: any;
  categoryOptions: any;
  bankOptions: any;
  locationOptions: any;
}) => {
  const { assetsTypeOptions, categoryOptions, bankOptions, locationOptions } =
    props;

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
          <HeroSearchBox
            assetsTypeOptions={assetsTypeOptions}
            categoryOptions={categoryOptions}
            bankOptions={bankOptions}
            locationOptions={locationOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
