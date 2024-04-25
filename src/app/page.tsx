import CustomReactCarousel from "@/components/atoms/CustomReactCarousel";
import HeroSection from "@/components/atoms/HeroSection";
import BankCollection from "@/components/molecules/BankCollection";
import CategoryCollection from "@/components/molecules/CategoryCollection";
import { fetchBanks, fetchLocation } from "@/server/actions";
import { getAssetType, getCarouselData, getCategoryBoxCollection } from "@/server/actions/auction";
import { sanitizeReactSelectOptions } from "@/shared/Utilies";
import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";

const getComponent = (componentName: string) => {
  switch (componentName) {
    case "CategoryCollection":
      return CategoryCollection;
    case "BankCollection":
      return BankCollection;
    default:
      return null;
  }
};

export default async function Home() {
  const carouselResponse = await getCarouselData();

  const assetsTypeOptions = await getAssetType() as unknown  as IAssetType[];
  const categoryOptions = await getCategoryBoxCollection() as unknown as ICategoryCollection[];
  const bankOptions = await fetchBanks() as unknown as IBanks[];
  const locationOptions = (await fetchLocation()) as unknown as ILocations[];

  const renderHomeCollection = () => {
    if (carouselResponse) {
      return (
        <section className="common-section md:my-auto my-12">
          {carouselResponse?.map(
            (
              item: {
                componentName: string;
                name: string;
                collectionData: any[];
              },
              index: number
            ) => {
              const ItemComponent = getComponent(item?.componentName) as any;
              return (
                <div key={index}>
                  <CustomReactCarousel
                    homePageCollection={undefined}
                    ItemComponent={item?.componentName}
                    title={item?.name}
                    slideCount={item?.collectionData?.length ?? 0}
                  >
                    {item?.collectionData?.map(
                      (subItem: any, index: number) => (
                        <ItemComponent key={index} item={subItem} />
                      )
                    )}
                  </CustomReactCarousel>
                </div>
              );
            }
          )}
        </section>
      );
    }
    return null;
  };

  return (
    <>
      <main className="mb-4">
        <section>
          <HeroSection
            assetsTypeOptions={sanitizeReactSelectOptions(assetsTypeOptions)}
            categoryOptions={sanitizeReactSelectOptions(categoryOptions)}
            bankOptions={sanitizeReactSelectOptions(bankOptions)}
            locationOptions={sanitizeReactSelectOptions(locationOptions)}
          />
        </section>
        {renderHomeCollection()}
      </main>
    </>
  );
}

export const revalidate = 3600; // 1hr
