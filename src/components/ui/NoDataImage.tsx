import React from "react";
import nodataimage from "@/assets/images/no-data.jpg";
import Image from "next/image";

const NoDataImage = () => {
  return (
    <>
      <div className="relative">
        <Image src={nodataimage} width={200} height={20} alt="no-data" />
      </div>
    </>
  );
};

export default NoDataImage;
