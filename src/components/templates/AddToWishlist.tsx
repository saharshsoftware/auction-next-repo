"use client";
import React, { useState } from "react";
import Select from "react-select";
import { ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IFavouriteList } from "@/types";
import { handleOnSettled } from "@/shared/Utilies";
import { useParams } from "next/navigation";
import ActionButton from "../atoms/ActionButton";
import {
  addPropertyToFavouriteListClient,
  fetchFavoriteListClient,
} from "@/services/favouriteList";
import { getAuctionDetailClient } from "@/services/auction";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import toast from "react-simple-toasts";

const AddToWishlist = () => {
  const params = useParams<{ slug: string; item: string }>();

  const [selectedOption, setSelectedOption] = useState<any>(null);

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
      const res =
        (await fetchFavoriteListClient()) as unknown as IFavouriteList[];
      const dropdownData = res.map((item) => ({
        value: item?.id,
        label: item?.name,
      }));
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
          toast("Successfully Added", {
            theme: "success",
            position: "top-center",
          });
        },
        fail: (error: any) => {
          const { message } = error;
          toast(message, {
            theme: "failure",
            position: "top-center",
          });
          // setRespError(message);
          setSelectedOption(null);
        },
      };
      handleOnSettled(response);
    },
  });

  const addPropertyToFavourite = () => {
    const body = {
      listId: selectedOption?.value ?? "",
      propertyId: auctionData?.id ?? "",
    };
    console.log(body);
    mutate(body);
    // resetForm();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // toast("Hello, World!", { theme: "success", position: "top-center" });
    // addToast("Saved Successfully", { appearance: "success" });
    if (!selectedOption) {
      setRespError("Please select a List");
      return;
    }
    // console.log(selectedOption);
    addPropertyToFavourite();
  };

  const renderer = () => {
    if (favouriteListData?.length === 0) {
      return <Link href={ROUTE_CONSTANTS.MANAGE_LIST} className="link link-primary text-center"> Create your list</Link>;
    }
    return (
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
          <span className="text-center text-sm text-red-700">{respError}</span>
        ) : null}
        <ActionButton
          isSubmit={true}
          text="Add"
          isLoading={isPending}
          disabled={isLoadingFavourite}
          customClass="w-full"
        />
      </form>
    );
  };
  return (
    <>
      <div className="custom-common-header-class">
        {STRING_DATA.ADD_TO_LIST}
      </div>
      <div className="custom-common-header-detail-class p-4">{renderer()}</div>
    </>
  );
};

export default AddToWishlist;
