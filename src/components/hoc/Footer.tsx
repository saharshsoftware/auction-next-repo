import React from "react";
import {STRING_DATA } from "../../shared/Constants";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="flex flex-col  gap-8 p-10 bg-neutral text-neutral-content rounded">
        <nav className="flex items-center justify-center gap-4 text-sm">
          <Link href={ROUTE_CONSTANTS.E_CITIES_ALL} className="link link-hover">
            {STRING_DATA.CITIES}
          </Link>
          <Link href={ROUTE_CONSTANTS.E_BANKS_ALL} className="link link-hover">
            {STRING_DATA.BANKS}
          </Link>
          <Link
            href={ROUTE_CONSTANTS.E_CATOGRIES_ALL}
            className="link link-hover"
          >
            {STRING_DATA.CATEGORIES}
          </Link>
        </nav>

        <nav className="flex md:flex-row flex-col items-center justify-center gap-4 text-sm">
          <Link href={ROUTE_CONSTANTS.TERMS} className="link link-hover">{STRING_DATA.TERMS_CONDITIONS}</Link>
          <Link href={ROUTE_CONSTANTS.PRIVACY} className="link link-hover">{STRING_DATA.PRIVACY_POLICY}</Link>
          <Link href={ROUTE_CONSTANTS.ABOUT_US} className="link link-hover">{STRING_DATA.ABOUT_US}</Link>
          <Link href={ROUTE_CONSTANTS.CONTACT} className="link link-hover">{STRING_DATA.CONTACT_US}</Link>
          <Link
            href={process.env.NEXT_PUBLIC_SITEMAP ?? ""}
            className="link link-hover"
            target="_blank"
          >
            {STRING_DATA.SITEMAP}
          </Link>
        </nav>

        <aside className="text-center text-sm">
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by{" "}
            {STRING_DATA.EAUCTION_DEKHO}
          </p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;

export const revalidate = 0