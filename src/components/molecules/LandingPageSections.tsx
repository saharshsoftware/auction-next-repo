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

interface ISectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  isEvenSection?: boolean;
}

const SectionWrapper = ({ children, className, isEvenSection = false }: ISectionWrapperProps) => {
  const bgClass = isEvenSection ? "bg-even-color" : "bg-odd-color";
  const defaultClassName = "section-class py-12";
  
  return (
    <section className={`${defaultClassName} ${bgClass} ${className || ""}`}>
      {children}
    </section>
  );
};

const AuthenticatedUserSections = async ({
  locationOptions,
  categoryOptions,
  assetsTypeOptions,
  bankOptions,
}: Omit<ILandingPageSectionProps, "isAuthenticated">) => {
  const [savedSearchesList, alertsList, favoriteLists] = await Promise.all([
    fetchSavedSearchServer(),
    fetchAlertsServer(),
    fetchFavoriteListServer(),
  ]);

  const transformedAlertList = alertsList?.map((item: IAlert) => {
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

  return (
    <>
      {/* Saved Searches Section */}
      <SectionWrapper>
        <SavedSearchesSection savedSearches={savedSearchesList?.slice(0, 3)} />
      </SectionWrapper>

      {/* Alerts Section */}
      <SectionWrapper isEvenSection>
        <AlertsSection
          alerts={transformedAlertList?.slice(0, 3)}
          isAuthenticated={true}
        />
      </SectionWrapper>

      {/* Wishlist Section */}
      <SectionWrapper>
        <WishlistSection
          favoriteLists={favoriteLists?.slice(0, 3)}
          isAuthenticated={true}
        />
      </SectionWrapper>
    </>
  );
};

export default async function LandingPageSection(props: ILandingPageSectionProps) {
  const {
    isAuthenticated,
    locationOptions = [],
    categoryOptions = [],
    assetsTypeOptions = [],
    bankOptions = [],
  } = props;

  return (
    <>
      {/* Show authenticated user sections only if user is logged in */}
      {isAuthenticated && (
        <AuthenticatedUserSections
          locationOptions={locationOptions}
          categoryOptions={categoryOptions}
          assetsTypeOptions={assetsTypeOptions}
          bankOptions={bankOptions}
        />
      )}

      {/* Partner and Help Section - Always shown for all users */}
      <SectionWrapper isEvenSection className="common-section">
        <PartnerAndHelpSection />
      </SectionWrapper>
    </>
  );
}
