"use client";
import { usePathname } from "next/navigation";
import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo";

const BreadcrumbsSeo = () => {
  const paths = usePathname();
  const pathnames = paths.split("/").filter((x) => x);

  const itemListElement = pathnames.map((value, index) => {
    const itemPath = `/${pathnames.slice(0, index + 1).join("/")}`;
    return {
      "@type": "ListItem",
      position: index + 1,
      name: value.charAt(0).toUpperCase() + value.slice(1),
      item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${itemPath}`,
    };
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_DOMAIN_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "eauctiondekho",
        item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/assets`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Explore Auctions in Every City and State Across India | eauctiondekhos",
        item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/cities`,
      },
      ...itemListElement,
    ],
  };

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={breadcrumbSchema.itemListElement}
      />

      <SiteLinksSearchBoxJsonLd
        url="https://www.eauctiondekho.com/"
        potentialActions={[
          {
            target:
              "https://www.eauctiondekho.com/search?q={search_term_string}",
            queryInput: "required name=search_term_string",
          },
        ]}
      />
    </>
  );
};

export default BreadcrumbsSeo;
