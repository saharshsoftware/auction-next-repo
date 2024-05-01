import useLocalStorage from '@/hooks/useLocationStorage';
import { COOKIES, FILTER_EMPTY } from '@/shared/Constants';
import { sanitizeStrapiImageUrl } from '@/shared/Utilies';
import React from 'react'

const CommonCollectionComp = (props: any) => {
  const { item = "" } = props;
  const [auctionFilter, setAuctionFilter] = useLocalStorage(
    COOKIES.AUCTION_FILTER,
    FILTER_EMPTY
  );

  const handleLinkClick = (propertyType: any) => {
    setAuctionFilter({
      ...FILTER_EMPTY,
      propertyType: {
        ...propertyType,
        label: propertyType?.name,
        value: propertyType?.id,
      },
    });
  };
  const imageUrl = sanitizeStrapiImageUrl(item);
  return <>CommonCollectionComp</>;
};

export default CommonCollectionComp