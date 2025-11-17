export interface DeepLinkRouteRule {
  readonly pattern: RegExp;
  readonly link?: string;
  readonly passthrough?: boolean;
}

/**
 * Ordered list of route patterns that map web paths to native routes.
 * Specific patterns are placed before generic fallbacks.
 */
export const deepLinkRoutes: ReadonlyArray<DeepLinkRouteRule> = [
  { pattern: /^profile$/, link: "profile" },
  { pattern: /^manage-alert/, link: "alerts" },
  { pattern: /^manage-list/, link: "wishlist" },
  { pattern: /^manage-filter/, link: "saved-search" },
  { pattern: /^auctions\/find-auctions/, link: "auctions" },
  { pattern: /^auctions\/[a-z0-9-]+$/i, passthrough: true },
  { pattern: /^e-auction-banks/, link: "banks" },
  { pattern: /^e-auction-categories/, link: "categories" },
  { pattern: /^e-auction-in-cities/, link: "locations" },
  { pattern: /^locations\/[^/]+\/banks\/[^/]+/, passthrough: true },
  { pattern: /^locations\/[^/]+\/categories\/[^/]+/, passthrough: true },
  { pattern: /^locations\/[^/]+\/types\/[^/]+/, passthrough: true },
  { pattern: /^banks\/[^/]+\/categories\/[^/]+/, passthrough: true },
  { pattern: /^banks\/[^/]+\/types\/[^/]+/, passthrough: true },
  { pattern: /^categories\/[^/]+\/types\/[^/]+/, passthrough: true },
  { pattern: /^banks/, link: "banks" },
  { pattern: /^categories/, link: "categories" },
  { pattern: /^cities/, link: "locations" },
  { pattern: /^locations/, link: "locations" },
  { pattern: /^collections/, link: "properties-collection" },
  { pattern: /^faq$/, link: "faq" },
  { pattern: /^contact-us$/, link: "contact" },
  { pattern: /^privacy$/, link: "settings/privacy" },
  { pattern: /^terms$/, link: "settings/terms" },
  { pattern: /^user\/recommendations$/, link: "recommended" },
  { pattern: /.*/, passthrough: true },
];

