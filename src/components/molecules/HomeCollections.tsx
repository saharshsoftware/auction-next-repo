"use client";
import { getHomeBoxCollection } from "@/server/actions/auction";
import { REACT_QUERY } from "@/shared/Constants";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CollectionComponent from "./CollectionComponent";
import CategoryCollection from "./CategoryCollection";
import BankCollection from "./BankCollection";
import { IHomeBoxCollection } from "@/types";
import SkeltonComponent from "../skeltons/SkeltonComponent";

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

const HomeCollections = () => {
  const {
    data: collectionsData,
    isLoading,
    fetchStatus,
  } = useQuery({
    queryKey: [REACT_QUERY.HOME_BOX_COLLETIONS],
    queryFn: async () => {
      const res =
        (await getHomeBoxCollection()) as unknown as IHomeBoxCollection[];
      return res ?? [];
    },
    enabled: true,
  });

  if (isLoading && fetchStatus === "fetching") {
    return (
      <div className="text-center">
        <SkeltonComponent />
      </div>
    );
  }

  if (!collectionsData?.length) return <SkeltonComponent />;

  return (
    <div>
      {collectionsData?.map((collection: any, index: number) => {
        const ItemComponent = getComponent(collection?.componentName);
        return (
          <div className="vertical-margin" key={index}>
            <CollectionComponent
              key={collection?._id}
              ItemComponent={ItemComponent}
              collection={collection}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HomeCollections;
