"use client"
import React, { useState } from 'react'
import Select from "react-select";
import { ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from '@/shared/Constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IFavouriteList } from '@/types';
import { handleOnSettled } from '@/shared/Utilies';
import { useParams } from "next/navigation";
import ActionButton from '../atoms/ActionButton';
import { addPropertyToFavouriteListClient, fetchFavoriteListClient } from '@/services/favouriteList';
import { getAuctionDetailClient } from '@/services/auction';

const AddToWishlist = () => {
  const params = useParams<{ slug: string; item: string }>();

  const [selectedOption, setSelectedOption] = useState<any>({value: '', label: ''});

  const { data: auctionData, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.AUCTION_DETAIL],
    queryFn: async () => {
      const res = (await getAuctionDetailClient({
        slug: params?.slug,
      })) as unknown as any;
      return res ?? [];
    },
  });

  // console.log(auctionData, "auctionData-favourite");

  const { data: favouriteListData, isLoading: isLoadingFavourite } = useQuery({
    queryKey: [REACT_QUERY.FAVOURITE_LIST],
    queryFn: async () => {
      const res = (await fetchFavoriteListClient()) as unknown as IFavouriteList[];
      const dropdownData = res.map((item)=> ({value: item?.id, label: item?.name}))
      // console.log(dropdownData, "dropdownData");
      return dropdownData ?? [];
    },
  });

  // const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: addPropertyToFavouriteListClient,
    onSettled: async (data) => {
      const response = {
        data,
        success: () => {
          setSelectedOption(null);
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
          setSelectedOption(null);
        },
      };
      handleOnSettled(response);
    },
  });

  const addPropertyToFavourite = () => {
    const body = {
      listId: selectedOption?.value ?? "",
      propertyId: auctionData?.id ?? '',
    };
    console.log(body);
    mutate(body);
    // resetForm();
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    if (!selectedOption) {
      setRespError("List is required")
      return
    }
    // console.log(selectedOption);
    addPropertyToFavourite();
  };

  return (
    <>
      <div className="custom-common-header-class">
        {STRING_DATA.ADD_TO_LIST}
      </div>
      <div className="custom-common-header-detail-class p-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <Select
            className="w-full"
            placeholder="Select list"
            name="wishlist"
            value={selectedOption}
            onChange={setSelectedOption}
            options={favouriteListData}
          />

          {respError ? (
            <span className="text-center text-sm text-red-700">
              {respError}
            </span>
          ) : null}
          <ActionButton
            isSubmit={true}
            text="Add"
            isLoading={isPending}
            disabled={isLoadingFavourite}
            customClass="w-full"
          />
        </form>
      </div>
    </>
  );
}

export default AddToWishlist