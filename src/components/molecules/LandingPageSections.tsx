import {
  IAlert,
  IAssetType,
  IBanks,
  ICategoryCollection,
  ILocations,
} from "@/types";
import { AlertsSection } from "../atoms/AlertsSection";
import PartnerAndHelpSection from "../atoms/PartnerAndHelpSection";
import { SavedSearchesSection } from "../atoms/SavedSearchesSection";
import { WishlistSection } from "../atoms/WishlistSection";
import {
  fetchSavedSearchServer,
  fetchAlertsServer,
  fetchFavoriteListServer,
} from "@/server/actions/auction";

interface ILandingPageSectionProps {
  isAuthenticated: boolean;
  locationOptions: ILocations[];
  categoryOptions: ICategoryCollection[];
  assetsTypeOptions: IAssetType[];
  bankOptions: IBanks[];
}

export default async function LandingPageSection(
  props: ILandingPageSectionProps
) {
  const {
    isAuthenticated,
    locationOptions = [],
    categoryOptions = [],
    assetsTypeOptions = [],
    bankOptions = [],
  } = props;
  const savedSearchesList = isAuthenticated
    ? await fetchSavedSearchServer()
    : [];
  const alertsList = isAuthenticated ? await fetchAlertsServer() : [];
  const updateAlertList = isAuthenticated
    ? alertsList?.map((item: IAlert) => {
        return {
          ...item,
          locationType: locationOptions?.find(
            (location) => location?.name === item?.location
          )?.type,
          location: locationOptions?.find(
            (location) => location?.name === item?.location
          ),
          category: categoryOptions?.find(
            (category) => category?.name === item?.assetCategory
          ),
          propertyType: assetsTypeOptions?.find(
            (asset) => asset?.name === item?.assetType
          ),
          bank: bankOptions?.find((bank) => bank?.name === item?.bankName),
        };
      })
    : [];
  const favoriteLists = isAuthenticated ? await fetchFavoriteListServer() : [];

  return (
    <>
      {/* Saved Searches Section */}
      <section className="section-class py-12 bg-odd-color">
        <SavedSearchesSection savedSearches={savedSearchesList?.slice(0, 3)} />
      </section>

      {/* Alerts Section */}
      <section className="section-class py-12 bg-even-color">
        <AlertsSection
          alerts={updateAlertList?.slice(0, 3)}
          isAuthenticated={isAuthenticated}
        />
      </section>

      {/* Wishlist Section */}
      <section className="section-class py-12 bg-odd-color">
        <WishlistSection
          favoriteLists={favoriteLists?.slice(0, 3)}
          isAuthenticated={isAuthenticated}
        />
      </section>

      <section className="common-section py-12 bg-even-color">
        <PartnerAndHelpSection />
      </section>
    </>
  );
}
