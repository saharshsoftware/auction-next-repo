/* eslint-disable react-hooks/exhaustive-deps */
// src/components/molecules/LandingPageSectionClient.tsx
"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { AlertSectionData, AlertsSection } from "@/components/atoms/AlertsSection";
import PartnerAndHelpSection from "@/components/atoms/PartnerAndHelpSection";
import { SavedSearchSectionData, SavedSearchesSection } from "@/components/atoms/SavedSearchesSection";
import { FavoriteListSectionData, WishlistSection } from "@/components/atoms/WishlistSection";
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

  const [savedSearches, setSavedSearches] = useState<SavedSearchSectionData[]>([]);
  const [favoriteLists, setFavoriteLists] = useState<FavoriteListSectionData[]>([]);

  const hydrateAlerts = (alertsRaw: IAlert[]): AlertSectionData[] => {
    return alertsRaw.map((item: IAlert) => ({
      ...item,
      locationType: locationOptions.find((l) => l?.name === item?.location)?.type,
      location: locationOptions.find((l) => l?.name === item?.location),
      category: categoryOptions.find((c) => c?.name === item?.assetCategory),
      propertyType: assetsTypeOptions.find((a) => a?.name === item?.assetType),
      bank: bankOptions.find((b) => b?.name === item?.bankName),
    })) as unknown as AlertSectionData[];
  };

  const resetUserData = () => {
    setIsAuthenticated(false);
    setAlerts([]);
    setSavedSearches([]);
    setFavoriteLists([]);
  };

  const fetchUserData = async (abortSignal: AbortSignal): Promise<void> => {
    try {
      const [alertsRes, savedRes, favsRes] = await Promise.all([
        fetchAlerts().catch(() => ({ data: [], status: 400 })),
        fetchSavedSearch().catch(() => ({ data: [], status: 400 })),
        fetchFavoriteListClient().catch(() => ({ data: [], status: 400 })),
      ]);

      if (abortSignal.aborted) return;

      const alertsRaw: IAlert[] = (alertsRes)?.data || [];
      const savedRaw: SavedSearchSectionData[] = (savedRes)?.data || [];
      const favsRaw: FavoriteListSectionData[] = (favsRes)?.data || [];

      setAlerts(hydrateAlerts(alertsRaw));
      setSavedSearches(savedRaw);
      setFavoriteLists(favsRaw);
    } catch (err) {
      if (abortSignal.aborted) return;
      resetUserData();
    }
  };

  useEffect(() => {
    const token = getCookie(COOKIES.TOKEN_KEY);
    if (!token) {
      resetUserData();
      return;
    }

    setIsAuthenticated(true);
    const abortController = new AbortController();
    fetchUserData(abortController.signal);

    return () => {
      abortController.abort();
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