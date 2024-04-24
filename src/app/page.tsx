import CustomReactCarousel from "@/components/atoms/CustomReactCarousel";
import HeroSection from "@/components/atoms/HeroSection";

// const HeroSection = dynamic(() => import("@/components/atoms/HeroSection"), {
//   ssr: false,
// });
import BankCollection from "@/components/molecules/BankCollection";
import CategoryCollection from "@/components/molecules/CategoryCollection";
import { getCarouselData } from "@/server/actions/auction";

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

  const renderHomeCollection = () => {
    if (carouselResponse) {
      return (
        <section className="common-section md:my-auto mt-12">
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
    <main className="mb-4">
      <section>
        <HeroSection />
      </section>
      {renderHomeCollection()}
    </main>
  );
}

export const revalidate = 3600; // 1hr
