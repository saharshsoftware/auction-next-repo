"use client";
import {
  fetchFavoriteListProperty,
  removePropertyFromFavoriteList,
} from "@/server/actions/favouriteList";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import FavouritePropertyCard from "../atoms/FavouritePropertyCard";
import { IAuction, IFavouriteListProperty } from "@/types";
import ConfirmationModal from "../ modals/ConfirmationModal";
import useModal from "@/hooks/useModal";
import { handleOnSettled } from "@/shared/Utilies";
import {
  fetchFavoriteListPropertyClient,
  removePropertyFromFavoriteListClient,
} from "@/services/favouriteList";
import AuctionCard from "../atoms/AuctionCard";

interface IFavouriteListPropertyComp {
  listId: string;
}

const FavouriteListProperty = (props: IFavouriteListPropertyComp) => {
  const { listId = "" } = props;
  const queryClient = useQueryClient();
  const [selectedCard, setSelectedCard] = useState<any>();
  const {
    showModal: showModalDelete,
    openModal: openModalDelete,
    hideModal: hideModalDelete,
  } = useModal();

  const {
    data: favouriteListPropertyData,
    isLoading: isLoadingFavouriteListProperty,
    refetch,
  } = useQuery({
    queryKey: [REACT_QUERY.FAVOURITE_LIST_PROPERTY, listId],
    queryFn: async () => {
      const res = (await fetchFavoriteListPropertyClient({
        listId: listId,
      })) as unknown as IFavouriteListProperty[];
      return res ?? [];
    },
    enabled: false,
  });

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: removePropertyFromFavoriteListClient,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: async () => {
          refetch();
          closeDeleteModal?.();
          return await queryClient.invalidateQueries({
            queryKey: [REACT_QUERY.FAVOURITE_LIST_PROPERTY],
          });
        },
        fail: (error: any) => {
          const { message } = error;
          // setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  useEffect(() => {
    if (listId) {
      refetch();
      console.log(listId);
    }
  }, [listId]);

  const handleRemove = (data: IFavouriteListProperty) => {
    console.log(data);
    showModalDelete();
    setSelectedCard(data);
  };

  const closeDeleteModal = () => {
    setSelectedCard("");
    hideModalDelete();
  };

  const handleDeleteAction = () => {
    // mutate({ id: selectedCard?.id });
    mutate({ id: selectedCard });
  };

  const renderFavoriteListProperty = () => {
    if (isLoadingFavouriteListProperty) {
      return <div className="text-center">Loading ...</div>;
    }

    if (favouriteListPropertyData?.length === 0) {
      return (
        <div className="text-center">
          {STRING_DATA.NO_DATA_FOUND_LIST_PROPERTY}
        </div>
      );
    }
    return (
      <>
        <div className="flex flex-col gap-4">
          {favouriteListPropertyData?.map(
            (item: IFavouriteListProperty, index: number) => {
              const propertyInformation = item?.property as unknown as IAuction;
              return (
                <div key={index}>
                  <AuctionCard
                    showRemoveButton={true}
                    item={propertyInformation}
                    // propertyData={propertyInformation}
                    propertyId={item?.id}
                    handleRemove={handleRemove}
                  />
                </div>
              );
            }
          )}
        </div>
      </>
    );
  };
  return (
    <>
      {/* Delete */}
      <ConfirmationModal
        message={STRING_DATA.MESSAGE_PROCEED}
        openModal={openModalDelete}
        actionLabel={STRING_DATA.REMOVE}
        hideModal={closeDeleteModal}
        onActionClick={handleDeleteAction}
        loading={isPending}
      />
      <div>{renderFavoriteListProperty()}</div>
    </>
  );
};

export default FavouriteListProperty;
