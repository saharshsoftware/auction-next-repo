import React, { type ReactElement } from "react";

/**
 * BreadcrumbJsonLd renders a JSON-LD BreadcrumbList for the current page.
 * Provide an ordered list of breadcrumb items with absolute URLs.
 */
interface IBreadcrumbItem {
  name: string;
  item: string;
}

interface IBreadcrumbJsonLdProps {
  items: readonly IBreadcrumbItem[];
}

const BreadcrumbJsonLd = ({ items }: IBreadcrumbJsonLdProps): ReactElement => {
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((breadcrumbItem: IBreadcrumbItem, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumbItem.name,
      item: `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}${breadcrumbItem.item}`,
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
    />
  );
};

export default BreadcrumbJsonLd;


