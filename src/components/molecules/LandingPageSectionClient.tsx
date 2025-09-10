// src/components/molecules/LandingPageSectionClient.tsx
"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { AlertSectionData, AlertsSection } from "@/components/atoms/AlertsSection";
import PartnerAndHelpSection from "@/components/atoms/PartnerAndHelpSection";
import { SavedSearchesSection } from "@/components/atoms/SavedSearchesSection";
import { WishlistSection } from "@/components/atoms/WishlistSection";
import { IAlert, IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";
import { COOKIES } from "@/shared/Constants";
import { fetchAlerts, fetchSavedSearch } from "@/services/auction";
import { fetchFavoriteListClient } from "@/services/favouriteList";

type Props = {
  locationOptions: ILocations[];
  categoryOptions: ICategoryCollection[];
  assetsTypeOptions: IAssetType[];
  bankOptions: IBanks[];
};

export default function LandingPageSectionClient(props: Props) {
  const { locationOptions = [], categoryOptions = [], assetsTypeOptions = [], bankOptions = [] } = props;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertSectionData[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [favoriteLists, setFavoriteLists] = useState<any[]>([]);

  useEffect(() => {
    const token = getCookie(COOKIES.TOKEN_KEY);
    if (!token) {
      setIsAuthenticated(false);
      setAlerts([]);
      setSavedSearches([]);
      setFavoriteLists([]);
      return;
    }

    let isCancelled = false;
    setIsAuthenticated(true);

    (async () => {
      try {
        const [alertsRes, savedRes, favsRes] = await Promise.all([
          fetchAlerts().catch(() => []),
          fetchSavedSearch().catch(() => []),
          fetchFavoriteListClient().catch(() => []),
        ]);

        const alertsRaw: IAlert[] = (alertsRes as any)?.data || alertsRes || [];
        const savedRaw: any[] = (savedRes as any)?.data || savedRes || [];
        const favsRaw: any[] = (favsRes as any)?.data || favsRes || [];

        const hydratedAlerts = (alertsRaw as IAlert[]).map((item: IAlert) => ({
          ...item,
          locationType: locationOptions.find((l) => l?.name === item?.location)?.type,
          location: locationOptions.find((l) => l?.name === item?.location),
          category: categoryOptions.find((c) => c?.name === item?.assetCategory),
          propertyType: assetsTypeOptions.find((a) => a?.name === item?.assetType),
          bank: bankOptions.find((b) => b?.name === item?.bankName),
        }));

        if (isCancelled) return;
        setAlerts(hydratedAlerts as unknown as AlertSectionData[]);
        setSavedSearches(savedRaw);
        setFavoriteLists(favsRaw);
      } catch (err) {
        if (isCancelled) return;
        setAlerts([]);
        setSavedSearches([]);
        setFavoriteLists([]);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [locationOptions, categoryOptions, assetsTypeOptions, bankOptions]);

  return (
    <>
      <section className="section-class py-12 bg-odd-color">
        <SavedSearchesSection savedSearches={savedSearches?.slice(0, 3)} />
      </section>

      <section className="section-class py-12 bg-even-color">
        <AlertsSection alerts={alerts?.slice(0, 3)} isAuthenticated={isAuthenticated} />
      </section>

      <section className="section-class py-12 bg-odd-color">
        <WishlistSection favoriteLists={favoriteLists?.slice(0, 3)} isAuthenticated={isAuthenticated} />
      </section>

      <section className="common-section py-12 bg-even-color">
        <PartnerAndHelpSection />
      </section>
    </>
  );
}