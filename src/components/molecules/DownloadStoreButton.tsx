import React from "react";
import googleplaystore from "@/assets/images/googleplaystore.png";
import appstore from "@/assets/images/appstore.png";
import Image from "next/image";
import { CONFIG } from "@/utilies/Config";

const storeClass = () => "w-[151px] h-[45px] relative cursor-pointer";

const DownloadStoreButton = (props: { className?: string }) => {
  const { className } = props;
  return (
    <>
      <div className={`${className || 'flex flex-row items-center justify-center gap-4 '}`}>
        <a
          href={CONFIG.PLAYSTORE_URL}
          target="_blank"
          rel="noreferrer"
          className={`${storeClass()}`}
        >
          <Image src={googleplaystore.src} fill={true} alt="googleplaystore" />
        </a>
        <a
          href={CONFIG.APPSTORE_URL}
          target="_blank"
          rel="noreferrer"
          className={`${storeClass()}`}
        >
          <Image src={appstore.src} fill={true} alt="appstore" />
        </a>
      </div>
    </>
  );
};

export default DownloadStoreButton;
