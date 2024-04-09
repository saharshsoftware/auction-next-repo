"use client"
import { IHomeBoxCollection } from '@/types';
import React, { useState } from 'react'
import CustomReactCarousel from '../atoms/CustomReactCarousel';
import { useQuery } from '@tanstack/react-query';
import { getCollectionData } from '@/server/actions';

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
      const res = await getCollectionData({
        endpoints: collection?.strapiAPIQuery,
      });
      console.log(res, 'res')
      setItems(res);
      return res ?? [];
    },
  });

  if (!items?.length || !ItemComponent) return null;

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
}

export default CollectionComponent