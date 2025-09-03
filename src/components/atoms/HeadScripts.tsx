"use client";
import { SITELINK_SEARCHBOX } from "@/shared/seo.constant";
import logo from "@/assets/images/logo.png";

const HeadScripts = () => {
  return (
    <>
      {/* Preconnect & Preload */}
      {/* <script src="/js/deeplink.js" defer></script> */}
      <link rel="preconnect" href="https://api.eauctiondekho.com" />
      <link rel="preload" as="image" href={logo.src} type="image/svg+xml" />

      {/* Structured Data Scripts */}
      {/* Breadcrumb is now injected per-page as JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITELINK_SEARCHBOX) }}
      />
    </>
  );
};

export default HeadScripts;
