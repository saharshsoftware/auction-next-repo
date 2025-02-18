import { STRING_DATA } from "@/shared/Constants";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function useFindUrl() {
  const currentRoute = usePathname();
  const [findUrl, setFindUrl] = useState({
    isBankRoute: false,
    isCategoryRoute: false,
    isLocationRoute: false,
    isAssetsRoute: false,
    isLocationBankRoute: false,
    isLocationTypesRoute: false,
    isLocationCategoriesRoute: false,
    isBankTypesRoute: false,
    isBankCategoriesRoute: false,
    isTypesRoute: false,
    isCategoryTypesRoute: false,
  });

  useEffect(() => {
    const pathSegments = currentRoute.split("/").filter(Boolean);
    const routeType = pathSegments[0];
    const subRoute = pathSegments[2];

    const newState = {
      isBankRoute: routeType === STRING_DATA.BANKS?.toLowerCase(),
      isCategoryRoute: routeType === STRING_DATA.CATEGORIES?.toLowerCase(),
      isLocationRoute: routeType === STRING_DATA.LOCATIONS?.toLowerCase(),
      isAssetsRoute: routeType === STRING_DATA.ASSETS_TYPE?.toLowerCase(),
      isTypesRoute: routeType === STRING_DATA.TYPES?.toLowerCase(),
      isLocationBankRoute:
        routeType === STRING_DATA.LOCATIONS?.toLowerCase() &&
        subRoute === STRING_DATA.BANKS?.toLowerCase(),
      isLocationTypesRoute:
        routeType === STRING_DATA.LOCATIONS?.toLowerCase() &&
        subRoute === STRING_DATA.TYPES?.toLowerCase(),
      isLocationCategoriesRoute:
        routeType === STRING_DATA.LOCATIONS?.toLowerCase() &&
        subRoute === STRING_DATA.CATEGORIES_LOWER?.toLowerCase(),
      isBankTypesRoute:
        routeType === STRING_DATA.BANKS?.toLowerCase() &&
        subRoute === STRING_DATA.TYPES?.toLowerCase(),
      isBankCategoriesRoute:
        routeType === STRING_DATA.BANKS?.toLowerCase() &&
        subRoute === STRING_DATA.CATEGORIES_LOWER?.toLowerCase(),
      isCategoryTypesRoute:
        routeType === STRING_DATA.CATEGORIES?.toLowerCase() &&
        subRoute === STRING_DATA.TYPES?.toLowerCase(),
    };

    // console.log("newState", newState);

    setFindUrl(newState);
  }, [currentRoute]);

  return {
    findUrl,
    bankRoute: findUrl.isBankRoute,
    categoryRoute: findUrl.isCategoryRoute,
    locationRoute: findUrl.isLocationRoute,
    assetsRoute: findUrl.isAssetsRoute,
    locationBankRoute: findUrl.isLocationBankRoute,
    locationTypesRoute: findUrl.isLocationTypesRoute,
    locationCategoriesRoute: findUrl.isLocationCategoriesRoute,
    bankTypesRoute: findUrl.isBankTypesRoute,
    bankCategoriesRoute: findUrl.isBankCategoriesRoute,
  };
}
