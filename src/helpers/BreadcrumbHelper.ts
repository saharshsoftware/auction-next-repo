import { IBreadcrumbItem } from "@/components/atoms/Breadcrumb";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

/**
 * Utility functions to generate common breadcrumb patterns
 */

export const generateCategoryBreadcrumb = (
  categoryName: string,
  categorySlug: string,
  currentPageTitle?: string,
  currentPageSlug?: string
): IBreadcrumbItem[] => {
  const items: IBreadcrumbItem[] = [
    {
      label: "Categories",
      href: ROUTE_CONSTANTS.E_CATOGRIES_ALL,
    },
    {
      label: categoryName,
      href: `${ROUTE_CONSTANTS.CATEGORY}/${categorySlug}`,
      isActive: !currentPageTitle,
    },
  ];

  if (currentPageTitle) {
    items.push({
      label: currentPageTitle,
      href: currentPageSlug ? `${ROUTE_CONSTANTS.CATEGORY}/${currentPageSlug}` : undefined,
      isActive: true,
    });
  }

  return items;
};

export const generateLocationBreadcrumb = (
  locationName: string,
  locationSlug: string,
  stateName?: string,
  currentPageTitle?: string
): IBreadcrumbItem[] => {
  const items: IBreadcrumbItem[] = [
    {
      label: "Cities",
      href: ROUTE_CONSTANTS.E_CITIES_ALL,
    },
  ];

  if (stateName) {
    items.push({
      label: stateName,
      href: `${ROUTE_CONSTANTS.LOCATION}/${locationSlug}`,
    });
  }

  items.push({
    label: locationName,
    href: currentPageTitle ? `${ROUTE_CONSTANTS.LOCATION}/${locationSlug}` : undefined,
    isActive: !currentPageTitle,
  });

  if (currentPageTitle) {
    items.push({
      label: currentPageTitle,
      isActive: true,
    });
  }

  return items;
};

export const generateBankBreadcrumb = (
  bankName: string,
  bankSlug: string,
  currentPageTitle?: string
): IBreadcrumbItem[] => {
  const items: IBreadcrumbItem[] = [
    {
      label: "Banks",
      href: ROUTE_CONSTANTS.E_BANKS_ALL,
    },
    {
      label: bankName,
      href: currentPageTitle ? `${ROUTE_CONSTANTS.BANKS}/${bankSlug}` : undefined,
      isActive: !currentPageTitle,
    },
  ];

  if (currentPageTitle) {
    items.push({
      label: currentPageTitle,
      isActive: true,
    });
  }

  return items;
};

export const generateAssetTypeBreadcrumb = (
  assetTypeName: string,
  assetTypeSlug: string,
  categoryName?: string,
  categorySlug?: string,
  currentPageTitle?: string
): IBreadcrumbItem[] => {
  const items: IBreadcrumbItem[] = [
    {
      label: "Asset Types",
      href: ROUTE_CONSTANTS.E_AUCTION_ASSETS,
    },
  ];

  if (categoryName && categorySlug) {
    items.push({
      label: categoryName,
      href: `${ROUTE_CONSTANTS.CATEGORY}/${categorySlug}`,
    });
  }

  items.push({
    label: assetTypeName,
    href: currentPageTitle ? `${ROUTE_CONSTANTS.TYPES}/${assetTypeSlug}` : undefined,
    isActive: !currentPageTitle,
  });

  if (currentPageTitle) {
    items.push({
      label: currentPageTitle,
      isActive: true,
    });
  }

  return items;
};

export const generateAuctionBreadcrumb = (
  auctionTitle: string,
  auctionSlug?: string,
  categoryName?: string,
  categorySlug?: string,
  locationName?: string,
  locationSlug?: string
): IBreadcrumbItem[] => {
  const items: IBreadcrumbItem[] = [
    {
      label: "Auctions",
      href: ROUTE_CONSTANTS.AUCTION,
    },
  ];

  if (categoryName && categorySlug) {
    items.push({
      label: categoryName,
      href: `${ROUTE_CONSTANTS.CATEGORY}/${categorySlug}`,
    });
  }

  if (locationName && locationSlug) {
    items.push({
      label: locationName,
      href: `${ROUTE_CONSTANTS.LOCATION}/${locationSlug}`,
    });
  }

  items.push({
    label: auctionTitle,
    href: auctionSlug ? `${ROUTE_CONSTANTS.AUCTION_SLASH}/${auctionSlug}` : undefined,
    isActive: true,
  });

  return items;
};

export const generateSearchBreadcrumb = (searchQuery?: string): IBreadcrumbItem[] => {
  const items: IBreadcrumbItem[] = [
    {
      label: "Search Results",
      isActive: !searchQuery,
    },
  ];

  if (searchQuery) {
    items.push({
      label: `"${searchQuery}"`,
      isActive: true,
    });
  }

  return items;
};

export const generateProfileBreadcrumb = (currentSection?: string): IBreadcrumbItem[] => {
  const items: IBreadcrumbItem[] = [
    {
      label: "Profile",
      href: currentSection ? ROUTE_CONSTANTS.PROFILE : undefined,
      isActive: !currentSection,
    },
  ];

  if (currentSection) {
    items.push({
      label: currentSection,
      isActive: true,
    });
  }

  return items;
};
