import Link from "next/link";
import Image from "next/image";
import { CONFIG } from "@/utilies/Config";
import googleplaystore from "@/assets/images/googleplaystore.png";
import appstore from "@/assets/images/appstore.png";
const storeClass = () => "w-[151px] h-[45px] relative cursor-pointer";

export default function DownloadBanner() {
  return (
    <section className="bg-brand-color1 py-16" id="download">
      <div className="common-section mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center ">
          <div className="max-w-xl mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-center mb-4">
              Download{" "}
              <span className="inline-block whitespace-nowrap break-keep">
                e-auctiondekho
              </span>{" "}
              app
            </h2>

            <p className=" mb-6 text-center">
              Get instant access to thousands of bank auctions right from your
              phone. Set alerts, save searches, and never miss a great deal
              again!
            </p>
            <div className="flex flex-col  justify-center items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href={CONFIG.PLAYSTORE_URL}
                target="_blank"
                rel="noreferrer"
                className={`${storeClass()}`}
              >
                <Image
                  src={googleplaystore.src}
                  fill={true}
                  alt="googleplaystore"
                />
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
          </div>
        </div>
      </div>
    </section>
  );
}
