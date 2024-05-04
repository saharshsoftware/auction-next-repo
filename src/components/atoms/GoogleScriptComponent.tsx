import React from "react";
import Script from "next/script";

const GoogleScriptComponent = () => {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-YKGYMMSPKR"
      ></Script>
      <Script id="gtm" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YKGYMMSPKR');
        `}
      </Script>
    </>
  );
};

export default GoogleScriptComponent;
