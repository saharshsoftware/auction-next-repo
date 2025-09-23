import React, { type ReactElement } from "react";

/**
 * ServiceJsonLd renders JSON-LD Service schemas for the current page.
 * Provide an array of service items with details.
 */
interface IServiceItem {
  serviceType: string;
  url: string;
  description: string;
}

interface IServiceJsonLdProps {
  services: readonly IServiceItem[];
  organizationName?: string;
  organizationUrl?: string;
  areaServed?: string;
}

const ServiceJsonLd = ({ 
  services, 
  organizationName = "e-auctiondekho",
  organizationUrl = "https://www.eauctiondekho.com",
  areaServed = "India"
}: IServiceJsonLdProps): ReactElement => {
  return (
    <>
      {services.map((service, index) => {
        const serviceJson = {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: service.serviceType,
          url: service.url,
          provider: {
            "@type": "Organization",
            name: organizationName,
            url: organizationUrl,
          },
          areaServed: {
            "@type": "Country",
            name: areaServed,
          },
          description: service.description,
        } as const;

        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJson) }}
          />
        );
      })}
    </>
  );
};

export default ServiceJsonLd;
