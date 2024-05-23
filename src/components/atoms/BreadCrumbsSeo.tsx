"use client";
import { usePathname } from "next/navigation";
import { BreadcrumbJsonLd } from "next-seo";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
const BreadcrumbsSeo = () => {
  const paths = usePathname();
  console.log(paths);
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
        name: "Auctions",
        item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Find Actions",
        item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/auctions/find-auctions`,
      },
      // ...itemListElement,
    ],
  };

  const renderBreadCrumbs = () => {
    if (false) {
      return (
        <>
          <Breadcrumbs>
            {breadcrumbSchema?.itemListElement?.map((item, index) => {
              return <BreadcrumbItem key={index}>{item?.name}</BreadcrumbItem>;
            })}
          </Breadcrumbs>
        </>
      );
    }
  };

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={breadcrumbSchema?.itemListElement}
      />
      {renderBreadCrumbs()}
    </>
  );
};

export default BreadcrumbsSeo;
