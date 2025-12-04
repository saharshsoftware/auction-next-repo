"use client";
import { RANGE_PRICE, STRING_DATA } from "@/shared/Constants";
import { useState, useEffect } from "react";
import SavedSearchModal from "../ modals/SavedSearchModal";
import LoginModal from "../ modals/LoginModal";
import SortByDropdown from "./SortByDropdown";
import MobileSortContainer from "./MobileSortContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { getDataFromQueryParamsMethod } from "@/shared/Utilies";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchSavedSearch } from "@/services/auction";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY } from "@/shared/Constants";
import { ISavedSearch } from "@/types";
import { LimitReachedBanner } from "../molecules/limit-reached-banner";
import { useIsAuthenticated, useUserData } from "@/hooks/useAuthenticated";

interface IAuctionHeaderSaveSearchProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const AuctionHeaderSaveSearch = ({ searchParams }: IAuctionHeaderSaveSearchProps) => {
  const [showSavedSearchModal, setShowSavedSearchModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { isAuthenticated } = useIsAuthenticated();
  // Use hydration-safe hook for token
  const { token } = useUserData();

  // Track when component has mounted to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const { isInternalUser } = useUserProfile(isAuthenticated);
  const {
    data: savedSearchData
  } = useQuery({
    queryKey: [REACT_QUERY.SAVED_SEARCH],
    queryFn: async () => {
      const res = (await fetchSavedSearch()) as unknown as ISavedSearch[];
      return res ?? [];
    },
    enabled: isAuthenticated,
    staleTime: 0,
  });
  const { canAddSavedSearch, isLoading: isLoadingAccess } = useSubscriptionAccess(
    {
      savedSearches: savedSearchData?.length ?? 0
    }
  );
  const encodedQuery: string = Array.isArray(searchParams?.q)
    ? (searchParams?.q?.[0] as string)
    : ((searchParams?.q as string) || "");
    const decodedFilters: any = getDataFromQueryParamsMethod(encodedQuery) || {};

  const getActiveFiltersCount = (): number => {
    let count = 0;
    const hasCategory = !!decodedFilters?.category?.name && decodedFilters?.category?.label !== STRING_DATA.ALL;
    const hasLocation = !!decodedFilters?.location?.name && decodedFilters?.location?.label !== STRING_DATA.ALL;
    const hasBank = !!decodedFilters?.bank?.name && decodedFilters?.bank?.label !== STRING_DATA.ALL;
    const hasPropertyType = !!decodedFilters?.propertyType?.name && decodedFilters?.propertyType?.label !== STRING_DATA.ALL;
    const hasPriceRange = Array.isArray(decodedFilters?.price) && decodedFilters?.price?.length > 0 && (
      Number(decodedFilters?.price?.[0]) !== Number(RANGE_PRICE.MIN) ||
      Number(decodedFilters?.price?.[1]) !== Number(RANGE_PRICE.MAX)
    );
    if (hasCategory) count++;
    if (hasLocation) count++;
    if (hasBank) count++;
    if (hasPropertyType) count++;
    if (hasPriceRange) count++;
    return count;
  };
  const activeFiltersCount: number = getActiveFiltersCount();

  const handleSaveSearchClick = () => {
    if (!token) {
      setShowLoginModal(true);
    } else if (canAddSavedSearch && !isLoadingAccess) {
      setShowSavedSearchModal(true);
    }
    // If can't add saved search, do nothing (button should be disabled)
  };

  const getButtonText = () => {
    // Before mount, always return default text to avoid hydration mismatch
    if (!hasMounted) return "Save this search";
    if (!token) return "Save this search";
    if (isLoadingAccess) return "Loading...";
    if (!canAddSavedSearch) return "Limit reached";
    return "Save this search";
  };

  const getSubText = () => {
    // Before mount, always return default text to avoid hydration mismatch
    if (!hasMounted) return "Resume your journey later with saved filters";
    if (!token) return "Resume your journey later with saved filters";
    if (isLoadingAccess) return "Checking availability...";
    if (!canAddSavedSearch) {
      return "You have reached the limit for saved searches";
    }
    return "Resume your journey later with saved filters";
  };

  // Only apply disabled state after mount to avoid hydration mismatch
  const shouldDisableButton = hasMounted && token && (!canAddSavedSearch || isLoadingAccess);
  const shouldShowUpgradePrompt = hasMounted && shouldDisableButton && !isLoadingAccess && isInternalUser;

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex items-center justify-between gap-2">
          <div className="max-w-fit flex flex-col gap-1">
            <button
              type="button"
              className={`link max-w-fit ${shouldDisableButton ? 'link-disabled cursor-not-allowed text-gray-400' : 'link-primary cursor-pointer'}`}
              onClick={shouldDisableButton ? undefined : handleSaveSearchClick}
              disabled={!!shouldDisableButton ? true : false}
            >
              {getButtonText().toUpperCase()}
            </button>
            {!shouldShowUpgradePrompt && (
              <div className="inline-flex items-center gap-2 text-xs py-1 rounded-full w-fit text-gray-600">
                <FontAwesomeIcon icon={faFilter} className="" />
                <span>{getSubText()}</span>
              </div>
            )}
          </div>
          <MobileSortContainer />
          <SortByDropdown />
        </div>
        {shouldShowUpgradePrompt && (
          <div className="mb-4">
          <LimitReachedBanner featureType="savedSearches" />
          </div>
        )}
      </div>
      <LoginModal openModal={showLoginModal} hideModal={() => setShowLoginModal(false)} />

      <SavedSearchModal
        openModal={showSavedSearchModal}
        hideModal={() => setShowSavedSearchModal(false)}
      />
    </>
  );
};

export default AuctionHeaderSaveSearch;
