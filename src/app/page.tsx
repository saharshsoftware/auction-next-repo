import CustomReactCarousel from "@/components/atoms/CustomReactCarousel";
import HeroSection from "@/components/atoms/HeroSection";
import AssetsCollection from "@/components/molecules/AssetsCollection";
import BankCollection from "@/components/molecules/BankCollection";
import CategoryCollection from "@/components/molecules/CategoryCollection";
import CommonCollectionComp from "@/components/molecules/CommonCollectionComp";
import { fetchBanks, fetchLocation } from "@/server/actions";
import {
  getAssetType,
  getCarouselData,
  getCategoryBoxCollection,
} from "@/server/actions/auction";
import { PAGE_REVALIDATE_TIME } from "@/shared/Constants";
import { sanitizeReactSelectOptions } from "@/shared/Utilies";
import { IAssetType, IBanks, ICategoryCollection, ILocations } from "@/types";

const getComponent = (componentName: string) => {
  switch (componentName) {
    case "CategoryCollection":
      return CategoryCollection;
    case "BankCollection":
      return BankCollection;
    case "AssetsCollection":
      return AssetsCollection;
    default:
      return CommonCollectionComp;
  }
};

export default async function Home() {
  const carouselResponse = await getCarouselData();

  const assetsTypeOptions = (await getAssetType()) as unknown as IAssetType[];
  const categoryOptions =
    (await getCategoryBoxCollection()) as unknown as ICategoryCollection[];
  const bankOptions = (await fetchBanks()) as unknown as IBanks[];
  const locationOptions = (await fetchLocation()) as unknown as ILocations[];

  const renderHomeCollection = () => {
    if (carouselResponse) {
      return (
        <section className="md:my-auto mt-12">
          {carouselResponse?.map(
            (
              item: {
                componentName: string;
                name: string;
                collectionData: any[];
                description?: string;
                title?: string;
                subTitle?: string;
                strapiAPIQuery?: string;
              },
              index: number
            ) => {
              const ItemComponent = getComponent(item?.componentName) as any;
              return (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-[#f0f1f8]" : "bg-[#fbfbfc]"
                  }`}
                >
                  <CustomReactCarousel
                    desc={item?.description ?? ""}
                    ItemComponent={item?.componentName}
                    title={item?.title ?? ""}
                    subTitle={item?.subTitle ?? ""}
                  >
                    {item?.collectionData?.map(
                      (subItem: any, index: number) => (
                        <ItemComponent
                          key={index}
                          item={subItem}
                          fetchQuery={item?.strapiAPIQuery}
                        />
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
    return "";
  };

  return (
    <>
      <main className="">
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

export const revalidate = PAGE_REVALIDATE_TIME;
