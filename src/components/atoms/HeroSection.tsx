import React from "react";

import waveImage from "@/assets/wave.svg";
import auctionbg from "@/assets/images/auctionbg.jpg";
import { STRING_DATA } from "../../shared/Constants";
import HeroSearchBox from "./HeroSearchBox";
import { CONFIG } from "@/utilies/Config";

const HeroSection = (props: {
  assetsTypeOptions: any;
  categoryOptions: any;
  bankOptions: any;
  locationOptions: any;
}) => {
  const { assetsTypeOptions, categoryOptions, bankOptions, locationOptions } =
    props;

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${waveImage?.src})`,
        }}
      >
        <div className="bg-opacity-60"></div>
        <div className=" text-center text-neutral-content lg:w-[920px] md:w-[720px] w-11/12">
          <div className="w-full">
            <h1 className="custom-h1-class lg:text-[4vh] text-lg font-bold text-white  mb-4">
              {STRING_DATA.TAG_LINE}
            </h1>
            <HeroSearchBox
              assetsTypeOptions={assetsTypeOptions}
              categoryOptions={categoryOptions}
              bankOptions={bankOptions}
              locationOptions={locationOptions}
            />
          </div>
        </div>
      </div>
      {/* Video Section */}
      {/* <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            See How It Works
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-[500px] rounded-xl shadow-lg"
                src={CONFIG.YOUTUBE_URL}
                title="Corta News App Explainer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default HeroSection;
