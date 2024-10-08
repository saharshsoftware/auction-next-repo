export const BREADCRUMB_LIST = {
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
