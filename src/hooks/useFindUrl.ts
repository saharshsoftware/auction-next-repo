import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function useFindUrl() {
  const currentRoute = usePathname();
  const [findUrl, setFindUrl] = useState({
    isBankRoute: false,
    isCategoryRoute: false,
    isLocationRoute: false,
  });

  useEffect(() => {
    console.log(currentRoute, currentRoute.startsWith("/category"));
    if (currentRoute.startsWith("/category")) {
      setFindUrl({
        isBankRoute: false,
        isCategoryRoute: true,
        isLocationRoute: false,
      });
      return;
    }
    if (currentRoute.startsWith("/bank")) {
      setFindUrl({
        isBankRoute: true,
        isCategoryRoute: false,
        isLocationRoute: false,
      });
      return;
    }
    if (currentRoute.startsWith("/location")) {
      setFindUrl({
        isBankRoute: false,
        isCategoryRoute: false,
        isLocationRoute: true,
      });
      return;
    }
    setFindUrl({
      isBankRoute: false,
      isCategoryRoute: false,
      isLocationRoute: false,
    });
  }, [currentRoute]);

  return {
    findUrl,
    bankRoute:findUrl?.isBankRoute,
    categoryRoute: findUrl?.isCategoryRoute,
    locationRoute: findUrl?.isLocationRoute
  };
}
