import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function useFindUrl() {
  const currentRoute = usePathname();
  const [findUrl, setFindUrl] = useState({
    isBankRoute: false,
    isCategoryRoute: false,
    isLocationRoute: false,
    isAssetsRoute: false
  });

  useEffect(() => {
    if (currentRoute.startsWith(ROUTE_CONSTANTS.CATEGORY)) {
      setFindUrl({
        isBankRoute: false,
        isCategoryRoute: true,
        isLocationRoute: false,
        isAssetsRoute: false,
      });
      return;
    }
    if (currentRoute.startsWith(ROUTE_CONSTANTS.BANKS)) {
      setFindUrl({
        isBankRoute: true,
        isCategoryRoute: false,
        isLocationRoute: false,
        isAssetsRoute: false,
      });
      return;
    }
    if (currentRoute.startsWith(ROUTE_CONSTANTS.LOCATION)) {
      setFindUrl({
        isBankRoute: false,
        isCategoryRoute: false,
        isLocationRoute: true,
        isAssetsRoute: false,
      });
      return;
    }
    if (currentRoute.startsWith(ROUTE_CONSTANTS.ASSETS_TYPE)) {
      setFindUrl({
        isBankRoute: false,
        isCategoryRoute: false,
        isLocationRoute: false,
        isAssetsRoute: true,
      });
      return;
    }
    setFindUrl({
      isBankRoute: false,
      isCategoryRoute: false,
      isLocationRoute: false,
      isAssetsRoute: false,
    });
  }, [currentRoute]);

  return {
    findUrl,
    bankRoute:findUrl?.isBankRoute,
    categoryRoute: findUrl?.isCategoryRoute,
    locationRoute: findUrl?.isLocationRoute,
    assetsRoute: findUrl?.isAssetsRoute
  };
}
