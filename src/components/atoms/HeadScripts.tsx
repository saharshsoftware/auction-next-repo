"use client";
import { BREADCRUMB_LIST, SITELINK_SEARCHBOX } from "@/shared/seo.constant";
import logo from "@/assets/images/logo.png";

const HeadScripts = () => {
  return (
    <>
      {/* Preconnect & Preload */}
      {/* <script src="/js/deeplink.js" defer></script> */}
      <link rel="preconnect" href="https://api.eauctiondekho.com" />
      <link rel="preload" as="image" href={logo.src} type="image/svg+xml" />

      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LIST) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITELINK_SEARCHBOX) }}
      />
    </>
  );
};

export default HeadScripts;
