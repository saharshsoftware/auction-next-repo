export const BREADCRUMB_LIST = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.eauctiondekho.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Categories",
      item: "https://www.eauctiondekho.com/categories",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Locations",
      item: "https://www.eauctiondekho.com/locations",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Banks",
      item: "https://www.eauctiondekho.com/banks",
    },
  ],
};

export const SITELINK_SEARCHBOX = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://www.eauctiondekho.com/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.eauctiondekho.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const SEO_BRAND = {
  SITE_NAME: "eauctiondekho" as const,
  TWITTER_HANDLE: "@eauctiondekho" as const,
  LOCALE: "en_IN" as const,
} as const;
