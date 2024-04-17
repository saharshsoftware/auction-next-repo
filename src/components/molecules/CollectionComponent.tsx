"use client";
import { IHomeBoxCollection } from "@/types";
import React, { useState } from "react";
import CustomReactCarousel from "../atoms/CustomReactCarousel";
import { useQuery } from "@tanstack/react-query";
import { getCollectionData } from "@/server/actions";
import SkeltonComponent, { Skelton } from "../skeltons/SkeltonComponent";
import { getCollectionDataClient } from "@/services/auction";

interface ICollectionComponent {
  ItemComponent: any;
  collection: IHomeBoxCollection;
  key: number;
}

const CollectionComponent = (props: ICollectionComponent) => {
  const { ItemComponent, collection, key } = props;
  const [items, setItems] = useState<any[]>([]);
  const {
    data: dataBank,
    isLoading,
    fetchStatus,
  } = useQuery({
    queryKey: [
      `collections-data-${collection?.strapiAPIQuery}`,
      collection?.strapiAPIQuery,
    ],
    queryFn: async () => {
      const res = await getCollectionDataClient({
        endpoints: collection?.strapiAPIQuery,
      });
      console.log(res, "res");
      setItems(res);
      return res ?? [];
    },
    staleTime: 300000, // 5 mins
  });

  console.log(dataBank, items, ItemComponent, ">>>>>cient");

  if (!items?.length || !ItemComponent) {
    return (
      <div className="flex flex-col gap-4 my-4">
        <div className="text-center">
          <div className="skeleton h-4 w-28 "></div>
        </div>
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skelton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomReactCarousel
        homePageCollection={undefined}
        ItemComponent={ItemComponent}
        title={collection?.name}
        slideCount={items?.length ?? 0}
      >
        {items.map((item, index) => (
          <ItemComponent
            key={index}
            item={item}
            fetchQuery={collection?.strapiAPIQuery}
          />
        ))}
      </CustomReactCarousel>
    </>
  );
};

export default CollectionComponent;
