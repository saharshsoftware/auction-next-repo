// src/components/molecules/HomeCollectionsServer.tsx
import CustomReactCarousel from "@/components/atoms/CustomReactCarousel";
import dynamic from "next/dynamic";
import { getCarouselData } from "@/server/actions/auction";

const CategoryCollection = dynamic(() => import("@/components/molecules/CategoryCollection"), { ssr: false });
const BankCollection = dynamic(() => import("@/components/molecules/BankCollection"), { ssr: false });
const AssetsCollection = dynamic(() => import("@/components/molecules/AssetsCollection"), { ssr: false });
const LocationCollection = dynamic(() => import("@/components/molecules/LocationCollection"), { ssr: false });
const CommonCollectionComp = dynamic(() => import("@/components/molecules/CommonCollectionComp"), { ssr: false });
const FavouriteListCollection = dynamic(() => import("@/components/molecules/FavouriteListCollection"), { ssr: false });
const FavouriteListCarousel = dynamic(() => import("@/components/atoms/FavouriteListCarousel"), { ssr: false });
const FavouriteListFilterWrapper = dynamic(() => import("@/components/atoms/FavouriteListFilterWrapper"), { ssr: false });

const getComponent = (name: string) => {
  switch (name) {
    case "CategoryCollection": return CategoryCollection;
    case "BankCollection": return BankCollection;
    case "AssetsCollection": return AssetsCollection;
    case "LocationCollection": return LocationCollection;
    case "FavouriteListCollection": return FavouriteListCollection;
    default: return CommonCollectionComp;
  }
};

export default async function HomeCollectionsServer() {
  const carouselResponse = await getCarouselData();
  if (!carouselResponse) return null;

  // Collect all favourite list items for city-matching fallback logic
  const favouriteListItems = carouselResponse.filter((item: any) => 
    item?.componentName === "FavouriteListCollection" || 
    item?.title?.toLowerCase() === "favourite list" ||
    item?.title?.toLowerCase().includes("favourite list")
  );

  return (
    <section className="md:my-auto mt-12">
      {carouselResponse.map((item: any, index: number) => {
        // Check if this is a FavouriteListCollection component
        const isFavouriteList = 
          item?.componentName === "FavouriteListCollection" || 
          item?.title?.toLowerCase() === "favourite list" ||
          item?.title?.toLowerCase().includes("favourite list");
        
        if (isFavouriteList) {
          // Use FavouriteListFilterWrapper to handle city-based filtering
          return (
            <FavouriteListFilterWrapper
              key={index}
              index={index}
              item={item}
              allItems={favouriteListItems}
            />
          );
        }

        // Default rendering for other collection types
        const ItemComponent: any = getComponent(item?.componentName);
        return (
          <div key={index} className={`${index % 2 !== 0 ? "bg-even-color" : "bg-odd-color"}`}>
            <CustomReactCarousel
              desc={item?.description ?? ""}
              ItemComponent={item?.componentName}
              title={item?.title ?? ""}
              subTitle={item?.subTitle ?? ""}
            >
              {item?.collectionData?.map((subItem: any, i: number) => (
                <ItemComponent key={i} item={subItem} fetchQuery={item?.strapiAPIQuery} />
              ))}
            </CustomReactCarousel>
          </div>
        );
      })}
    </section>
  );
}