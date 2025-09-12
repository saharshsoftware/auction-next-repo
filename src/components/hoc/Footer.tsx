import React from "react";
import { STRING_DATA } from "../../shared/Constants";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import DownloadStoreButton from "../molecules/DownloadStoreButton";
import { Mail } from "lucide-react";
import { getCurrentYear } from "@/shared/Utilies";
import Image from "next/image";
import { IMAGES } from "@/shared/Images";

const Footer: React.FC = () => {

  return (
    <>
       <footer className="bg-gray-900 text-neutral-content rounded-t">
        <div className="lg:p-10 px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-8">
            {/* Brand and App Links (mobile-first) */}
            <div className="col-span-1 md:col-span-2 text-left">
              <div className="my-4">
                <Link href={ROUTE_CONSTANTS.DASHBOARD} className="inline-flex items-center">
                  <span>
                    <Image
                      src={IMAGES.logoTransparent.src}
                      width={215}
                      height={100}
                      style={{ objectFit: "cover" }}
                      alt="eauctiondekho logo"
                    />
                  </span>
                </Link>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-white" />
                  {/* Add mailto link */}
                  <a href="mailto:contact@eauctiondekho.com" className="text-sm-xs hover:text-white transition-colors">contact@eauctiondekho.com</a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href={ROUTE_CONSTANTS.CITIES} className="text-sm-xs text-gray-300 hover:text-white transition-colors min-w-fit">
                    {STRING_DATA.CITIES}
                  </Link>
                </li>
                <li>
                  <Link href={ROUTE_CONSTANTS.BANKS} className="text-sm-xs text-gray-300 hover:text-white transition-colors min-w-fit">
                    {STRING_DATA.BANKS}
                  </Link>
                </li>
                <li>
                  <Link href={ROUTE_CONSTANTS.CATEGORY} className="text-sm-xs text-gray-300 hover:text-white transition-colors min-w-fit">
                    {STRING_DATA.CATEGORIES}
                  </Link>
                </li>
                <li>
                  <Link href={ROUTE_CONSTANTS.TYPES} className="text-sm-xs text-gray-300 hover:text-white transition-colors min-w-fit">
                    {STRING_DATA.ASSETS}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href={ROUTE_CONSTANTS.BLOGS} className="text-sm-xs text-gray-300 hover:text-white transition-colors">
                    {STRING_DATA.BLOGS}
                  </Link>
                </li>
                <li>
                  <Link href={ROUTE_CONSTANTS.FAQ} className="text-sm-xs text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap.xml.gz" className="text-sm-xs text-gray-300 hover:text-white transition-colors" target="_blank" rel="nofollow">
                    {STRING_DATA.SITEMAP}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company + Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href={ROUTE_CONSTANTS.ABOUT_US} className="text-sm-xs text-gray-300 hover:text-white transition-colors">
                    {STRING_DATA.ABOUT_US}
                  </Link>
                </li>
                <li>
                  <Link href={ROUTE_CONSTANTS.CONTACT} className="text-sm-xs text-gray-300 hover:text-white transition-colors">
                    {STRING_DATA.CONTACT_US}
                  </Link>
                </li>
              </ul>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href={ROUTE_CONSTANTS.TERMS} className="text-sm-xs text-gray-300 hover:text-white transition-colors">
                    {STRING_DATA.TERMS_CONDITIONS}
                  </Link>
                </li>
                <li>
                  <Link href={ROUTE_CONSTANTS.PRIVACY} className="text-sm-xs text-gray-300 hover:text-white transition-colors">
                    {STRING_DATA.PRIVACY_POLICY}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-center md:text-left">© {getCurrentYear()} Omnistack Innovation Pvt Ltd</p>
              <div className="flex items-center flex-col md:flex-row gap-3">
                <span className="text-sm font-medium text-gray-300">Download Mobile Apps</span>
                <DownloadStoreButton className="flex flex-row items-center gap-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
