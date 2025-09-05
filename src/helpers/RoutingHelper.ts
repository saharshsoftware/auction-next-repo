import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { getPathType } from "@/shared/Utilies";

export const applyFilters = (
  params:
    | {
        slug: string;
        slugasset: string;
        slugcategory: string;
        slugbank: string;
      }
    | undefined,
  currentRoute: string,
  locationOptions: any,
  assetsTypeOptions: any,
  bankOptions: any,
  categoryOptions: any,
  fillFilter: (options: any) => void,
  fillFilterWithTwoSlug: (options1: any, options2: any) => void
) => {
  if (!params) return;

  const { slug, slugasset, slugcategory, slugbank } = params;
  // console.log("(applyFilters)", { slug, slugasset, slugcategory, slugbank });

  if (slug && slugcategory) {
    if (
      currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION) &&
      locationOptions &&
      categoryOptions
    ) {
      // console.log("(applyFilters) slugcategory1");
      fillFilterWithTwoSlug(locationOptions, categoryOptions);
      return;
    }
    if (
      currentRoute.startsWith(ROUTE_CONSTANTS.BANKS) &&
      bankOptions &&
      categoryOptions
    ) {
      fillFilterWithTwoSlug(bankOptions, categoryOptions);
      return;
    }
    if (
      currentRoute.startsWith(ROUTE_CONSTANTS.CATEGORY) &&
      categoryOptions &&
      categoryOptions
    ) {
      fillFilterWithTwoSlug(categoryOptions, categoryOptions);
      return;
    }
  } else if (slug && slugbank) {
    if (
      currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION) &&
      locationOptions &&
      bankOptions
    ) {
      // console.log("(applyFilters) 1");
      fillFilterWithTwoSlug(locationOptions, bankOptions);
      return;
    }
  } else if (slug && slugasset) {
    if (
      currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION) &&
      locationOptions &&
      assetsTypeOptions
    ) {
      // console.log("(applyFilters) 1");
      fillFilterWithTwoSlug(locationOptions, assetsTypeOptions);
      return;
    }
    if (
      currentRoute.startsWith(ROUTE_CONSTANTS.BANKS) &&
      bankOptions &&
      assetsTypeOptions
    ) {
      fillFilterWithTwoSlug(bankOptions, assetsTypeOptions);
      return;
    }
    if (
      currentRoute.startsWith(ROUTE_CONSTANTS.CATEGORY) &&
      categoryOptions &&
      assetsTypeOptions
    ) {
      fillFilterWithTwoSlug(categoryOptions, assetsTypeOptions);
      return;
    }
  } else {
    if (currentRoute.startsWith(ROUTE_CONSTANTS.CATEGORY) && categoryOptions) {
      fillFilter(categoryOptions);
      return;
    }
    if (currentRoute.startsWith(ROUTE_CONSTANTS.BANKS) && bankOptions) {
      fillFilter(bankOptions);
      return;
    }
    if (currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION) && locationOptions) {
      fillFilter(locationOptions);
      return;
    }
    if (currentRoute.startsWith(ROUTE_CONSTANTS.TYPES) && assetsTypeOptions) {
      fillFilter(assetsTypeOptions);
      return;
    }
  }
};

export const fillFilterWithLocationsAndAssets = (
  locationList: any,
  assetTypeList: any,
  params: any,
  filterData: any,
  setInitialValueData: (data: any) => void,
  setFilter: (filter: any) => void,
  FILTER_EMPTY: any
) => {
  console.log("(fillFilterWithLocationsAndAssets)");
  if (!locationList || !assetTypeList || !params) return;

  const selectedLocation = locationList.find(
    (item: any) => item?.slug === params?.slug
  );
  const selectedAssetType = assetTypeList.find(
    (item: any) => item?.slug === params?.slugasset
  );

  // console.log("(fillFilterWithLocationsAndAssets)1", {
  //   selectedLocation,
  //   selectedAssetType,
  // });
  setInitialValueData({
    location: selectedLocation ?? filterData?.location ?? "",
    assetsType: selectedAssetType ?? filterData?.propertyType ?? "",
  });
  // console.log("(fillFilterWithLocationsAndAssets)2", {
  //   selectedLocation,
  //   selectedAssetType,
  // });
  setFilter({
    ...FILTER_EMPTY,
    location: selectedLocation,
    propertyType: selectedAssetType,
  });
};

export const fillFilterWithBanksAndAssets = (
  banksList: any,
  assetTypeList: any,
  params: any,
  filterData: any,
  setInitialValueData: (data: any) => void,
  setFilter: (filter: any) => void,
  FILTER_EMPTY: any
) => {
  console.log("(fillFilterWithBanksAndAssets)");
  if (!banksList || !assetTypeList || !params) return;

  const selectedBank = banksList.find(
    (item: any) =>
      item?.slug === params?.slug || item?.secondarySlug === params?.slug
  );
  const selectedAssetType = assetTypeList.find(
    (item: any) => item?.slug === params?.slugasset
  );

  // console.log("(fillFilterWithBanksAndAssets)1");
  setInitialValueData({
    bank: selectedBank ?? filterData?.bank ?? "",
    assetsType: selectedAssetType ?? filterData?.propertyType ?? "",
  });
  // console.log("(fillFilterWithBanksAndAssets)2");
  setFilter({
    ...FILTER_EMPTY,
    bank: selectedBank,
    propertyType: selectedAssetType,
  });
};

export const fillFilterWithCategoriesAndAssets = (
  categoriesList: any,
  assetTypeList: any,
  params: any,
  filterData: any,
  setInitialValueData: (data: any) => void,
  setFilter: (filter: any) => void,
  FILTER_EMPTY: any
) => {
  console.log("(fillFilterWithCategoriesAndAssets)");
  if (!categoriesList || !assetTypeList || !params) return;

  const selectedCategory = categoriesList.find(
    (item: any) => item?.slug === params?.slug
  );
  const selectedAssetType = assetTypeList.find(
    (item: any) => item?.slug === params?.slugasset
  );

  // console.log("(fillFilterWithCategoriesAndAssets)1");
  setInitialValueData({
    category: selectedCategory ?? filterData?.category ?? "",
    assetsType: selectedAssetType ?? filterData?.propertyType ?? "",
  });
  // console.log("(fillFilterWithCategoriesAndAssets)2");
  setFilter({
    ...FILTER_EMPTY,
    category: selectedCategory,
    propertyType: selectedAssetType,
  });
};

export const fillFilterWithLocationsAndBanks = (
  locations: any,
  bankslist: any,
  params: { slug: string; slugbank: string },
  filterData: any,
  setInitialValueData: (data: any) => void,
  setFilter: (filter: any) => void,
  FILTER_EMPTY: any
) => {
  console.log("(fillFilterWithLocationsAndBanks)");
  if (!locations || !bankslist || !params) return;

  const selectedLocation = locations.find(
    (item: any) => item?.slug === params?.slug
  );
  const selectedBank = bankslist.find(
    (item: any) =>
      item?.slug === params?.slugbank ||
      item?.secondarySlug === params?.slugbank
  );

  setInitialValueData({
    location: selectedLocation ?? filterData?.location ?? "",
    bank: selectedBank ?? filterData?.bank ?? "",
  });

  setFilter({
    ...FILTER_EMPTY,
    location: selectedLocation,
    bank: selectedBank,
  });
};

export const fillFilterWithLocationsAndCategories = (
  locationList: any,
  categoriesList: any,
  params: { slug: string; slugcategory: string },
  filterData: any,
  setInitialValueData: (data: any) => void,
  setFilter: (filter: any) => void,
  FILTER_EMPTY: any
) => {
  console.log("(fillFilterWithLocationsAndCategories)");
  if (!locationList || !categoriesList || !params) return;

  const selectedLocation = locationList.find(
    (item: any) => item?.slug === params?.slug
  );
  const selectedCategory = categoriesList.find(
    (item: any) => item?.slug === params?.slugcategory
  );

  // console.log("(fillFilterWithLocationsAndCategories)1", {
  //   selectedLocation,
  //   selectedCategory,
  // });
  setInitialValueData({
    location: selectedLocation ?? filterData?.location ?? "",
    category: selectedCategory ?? filterData?.category ?? "",
  });
  // console.log("(fillFilterWithLocationsAndCategories)2", {
  //   selectedLocation,
  //   selectedCategory,
  // });
  setFilter({
    ...FILTER_EMPTY,
    location: selectedLocation,
    category: selectedCategory,
  });
};

export const fillFilterWithBanksAndCategories = (
  banksList: any,
  categoriesList: any,
  params: { slug: string; slugcategory: string },
  filterData: any,
  setInitialValueData: (data: any) => void,
  setFilter: (filter: any) => void,
  FILTER_EMPTY: any
) => {
  console.log("(fillFilterWithBanksAndCategories)");
  if (!banksList || !categoriesList || !params) return;

  const selectedBank = banksList.find(
    (item: any) =>
      item?.slug === params?.slug || item?.secondarySlug === params?.slug
  );
  const selectedCategory = categoriesList.find(
    (item: any) => item?.slug === params?.slugcategory
  );

  // console.log("(fillFilterWithBanksAndCategories)1");
  setInitialValueData({
    bank: selectedBank ?? filterData?.bank ?? "",
    category: selectedCategory ?? filterData?.selectedCategory ?? "",
  });
  console.log("(fillFilterWithBanksAndCategories)2");
  setFilter({
    ...FILTER_EMPTY,
    bank: selectedBank,
    category: selectedCategory,
  });
};

export const fillFilterHelper = (
  data: any,
  currentRoute: string,
  params: any,
  filterData: any,
  setInitialValueData: (data: any) => void,
  setFilter: (filter: any) => void,
  FILTER_EMPTY: any
) => {
  if (!data || !params?.slug) return;

  // Extract the base route (e.g., "/locations" from "/locations/jaipur/plot")
  console.log("INFO:: (cfillFilterHelperurrentRoute)1", { currentRoute });
  const baseRoute = Object.values(ROUTE_CONSTANTS).find(
    (route) => route !== "/" && currentRoute.startsWith(route)
  );

  //   console.log("INFO:: (cfillFilterHelperurrentRoute)2", { baseRoute });
  if (!baseRoute) return;

  // Mapping of routes to the corresponding state keys
  const filterKeyMap: Record<string, string[]> = {
    [ROUTE_CONSTANTS.CATEGORY]: ["categories"],
    [ROUTE_CONSTANTS.LOCATION]: ["locations"],
    [ROUTE_CONSTANTS.BANKS]: ["banks"],
    [ROUTE_CONSTANTS.PROPERTY_TYPES]: ["types"],
  };

  const stateKeys = filterKeyMap[baseRoute];
  if (!stateKeys) return;

  // Find selected items from the data list
  const selectedValues: Record<string, any> = {};
  stateKeys.forEach((key, index) => {
    const slugParam = index === 0 ? params?.slug : params?.slugasset;
    const pathType = getPathType(key);
    if (pathType) {
      selectedValues[pathType] = data.find(
        (item: any) =>
          item?.slug === slugParam || item?.secondarySlug === params?.slug
      );
    }
  });

  //   console.log("INFO:: (selectedValues)", { selectedValues, stateKeys });

  // Update initial state
  setInitialValueData({
    ...Object.fromEntries(
      stateKeys.map((key) => [
        key,
        selectedValues[key] ?? filterData?.[key] ?? "",
      ])
    ),
  });

  // Update filter state
  setFilter({
    ...FILTER_EMPTY,
    ...selectedValues,
  });
};
