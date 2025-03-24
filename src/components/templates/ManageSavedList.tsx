"use client";
import CustomBadge from "@/components/atoms/CustomBadge";
import { POPULER_CITIES, REACT_QUERY, STRING_DATA } from "@/shared/Constants";

import React, { useState } from "react";
import CreateFavList from "../ modals/CreateFavList";
import useModal from "@/hooks/useModal";
import ActionButton from "../atoms/ActionButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteFavoriteList,
  fetchFavoriteList,
} from "@/server/actions/favouriteList";
import { IFavouriteList, ISavedSearch } from "@/types";
import FavouriteListProperty from "./FavouriteListProperty";
import ConfirmationModal from "../ modals/ConfirmationModal";
import EditSavedList from "../ modals/EditSavedList";
import { handleOnSettled } from "@/shared/Utilies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import {
  deleteFavoriteListClient,
  fetchFavoriteListClient,
} from "@/services/favouriteList";
import { deleteSavedSearch, fetchSavedSearch } from "@/services/auction";

const ManageSavedList = () => {
  const queryClient = useQueryClient();
  const [activeBadgeData, setActiveBadgeData] = useState<ISavedSearch>();
  const [selectedBadge, setSelectedBadge] = useState<any>();
  const { showModal, openModal, hideModal } = useModal();
  const {
    showModal: showModalDelete,
    openModal: openModalDelete,
    hideModal: hideModalDelete,
  } = useModal();

  const {
    showModal: showModalEdit,
    openModal: openModalEdit,
    hideModal: hideModalEdit,
  } = useModal();

  const {
    data: savedSearchData,
    fetchStatus,
    isLoading: isLoadingSaved,
  } = useQuery({
    queryKey: [REACT_QUERY.SAVED_SEARCH],
    queryFn: async () => {
      const res = (await fetchSavedSearch()) as unknown as ISavedSearch[];
      return res ?? [];
    },
    staleTime: 0,
  });

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: deleteSavedSearch,
    onSettled: async (data) => {
      console.log(data);
      hideModalDelete();
      const response = {
        data,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [REACT_QUERY.SAVED_SEARCH],
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

  const handleDeleteModal = (data: any) => {
    console.log(data);
    showModalDelete();
    setSelectedBadge(data);
  };

  const handleEditModal = (data: any) => {
    console.log(data);
    showModalEdit();
    setSelectedBadge(data);
  };

  const closeDeleteModal = () => {
    setSelectedBadge("");
    hideModalDelete();
  };

  const openEditModal = () => {
    showModalEdit();
  };

  const handleDeleteAction = () => {
    // refetch();

    mutate({ id: selectedBadge?.id ?? "" });
  };

  const renderData = () => {
    if (isLoadingSaved) {
      return <div className="text-center">Loading ...</div>;
    }

    if (savedSearchData?.length === 0) {
      return (
        <div className="text-center break-all">
          {STRING_DATA.NO_SAVED_LIST_FOUND}
        </div>
      );
    }
    return (
      <>
        <div className="flex flex-col gap-4 min-w-full ">
          {savedSearchData?.map((item, index) => (
            <div
              key={index}
              className="flex md:flex-row flex-col items-start justify-between gap-4 w-full border border-brand-color shadow px-2 py-1 rounded-lg"
            >
              <div>{item?.name}</div>
              <div className="flex items-center justify-end gap-4">
                <ActionButton
                  text="Edit"
                  onclick={() => handleEditModal(item)}
                  icon={<FontAwesomeIcon icon={faPencil} />}
                />
                <ActionButton
                  text="Delete"
                  onclick={() => handleDeleteModal(item)}
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  isDeleteButton={true}
                />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Create List Modal */}
      <EditSavedList
        fieldata={selectedBadge}
        openModal={openModalEdit}
        hideModal={hideModalEdit}
        deleteLoading={isPending}
        deleteAction={handleDeleteAction}
      />

      {/* Delete */}
      <ConfirmationModal
        message={STRING_DATA.DELETE_SEARCH_ITEM_MESSAGE}
        openModal={openModalDelete}
        actionLabel={STRING_DATA.DELETE}
        hideModal={closeDeleteModal}
        onActionClick={handleDeleteAction}
        loading={isPending}
      />

      <div className="common-list-section-class my-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="custom-h2-class">{STRING_DATA.YOUR_FILTERS}</div>
          </div>
          {renderData()}
        </div>
      </div>
    </>
  );
};

export default ManageSavedList;
