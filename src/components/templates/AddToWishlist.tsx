import React from "react";
import { STRING_DATA } from "@/shared/Constants";

import { IAuction, IFavouriteList } from "@/types";
import dynamic from "next/dynamic";

const WishlistClient = dynamic(() => import("../atoms/WishlistClient"), {
  ssr: false,
});

const AddToWishlist = async (props: {
  auctionData?: IAuction;
  faviouriteList?: IFavouriteList[];
  isAuthenticated?: boolean;
}) => {
  const { auctionData, faviouriteList = [], isAuthenticated = false } = props;

  return (
    <div>
      <div className="custom-common-header-class">
        {STRING_DATA.ADD_TO_COLLECTION}
      </div>
      <div className="custom-common-header-detail-class p-4">
        <WishlistClient
          auctionData={auctionData}
          favouriteListData={faviouriteList}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
};

export default AddToWishlist;
