"use client";
import CustomBadge from "@/components/atoms/CustomBadge";
import { POPULER_CITIES, REACT_QUERY, STRING_DATA } from "@/shared/Constants";

import React, { useState } from "react";
import CreateFavList from "../ modals/CreateFavList";
import useModal from "@/hooks/useModal";
import ActionButton from "../atoms/ActionButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFavoriteList, fetchFavoriteList } from "@/server/actions/favouriteList";
import { IFavouriteList } from "@/types";
import FavouriteListProperty from "./FavouriteListProperty";
import ConfirmationModal from "../ modals/ConfirmationModal";
import EditFavList from "../ modals/EditFavList";
import { handleOnSettled } from "@/shared/Utilies";

const ManageListComp = () => {
  const queryClient = useQueryClient();
  const [activeBadgeData, setActiveBadgeData] = useState<IFavouriteList>();
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
    data: favouriteListData,
    isLoading: isLoadingFavourite,
    fetchStatus,
  } = useQuery({
    queryKey: [REACT_QUERY.FAVOURITE_LIST],
    queryFn: async () => {
      const res = (await fetchFavoriteList()) as unknown as IFavouriteList[];
      setActiveBadgeData(res?.[0]);
      return res ?? [];
    },
  });

  const { isLoading: isLoadingDelete, refetch } = useQuery({
    queryKey: [REACT_QUERY.FAVOURITE_LIST, selectedBadge?.id],
    queryFn: async () => {
      const res = (await deleteFavoriteList({
        id: selectedBadge?.id,
      })) as unknown as IFavouriteList[];
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY.FAVOURITE_LIST],
      });
      closeDeleteModal();
      return res ?? [];
    },
    enabled: false,
  });

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFavoriteList,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [REACT_QUERY.FAVOURITE_LIST],
          });
          hideModalEdit()
        },
        fail: (error: any) => {
          const { message } = error;
          hideModalEdit()
          // setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });



  const handleBadgeClick = (data: any) => {
    console.log(data);
    setActiveBadgeData(data);
  };

  const closeDeleteModal = () => {
    setSelectedBadge("");
    hideModalDelete();
  };

  const handleSettingClick = (data: IFavouriteList) => {
    setSelectedBadge(data);
    showModalEdit();
  };

  const handleDeleteAction = () => {
    // refetch();

    mutate({ id: selectedBadge?.id });
  };

  const renderData = () => {
    if (isLoadingFavourite) {
      return <div className="text-center">Loading ...</div>;
    }

    if (favouriteListData?.length === 0) {
      return <div className="text-center">No data found</div>;
    }
    return (
      <>
        <div className="flex gap-4 min-w-full overflow-x-scroll">
          {favouriteListData?.map((item, index) => (
            <CustomBadge
              key={index}
              item={{ label: item?.name, ...item }}
              activeBadge={activeBadgeData}
              onclick={handleBadgeClick}
              onclickSetting={handleSettingClick}
              showSettingIcon={true}
            />
          ))}
        </div>
        {activeBadgeData ? (
          <FavouriteListProperty listId={activeBadgeData?.id ?? ""} />
        ) : null}
      </>
    );
  };

  return (
    <>
      {/* Create List Modal */}
      <CreateFavList openModal={openModal} hideModal={hideModal} />

      {/* Create List Modal */}
      <EditFavList
        fieldata={selectedBadge}
        openModal={openModalEdit}
        hideModal={hideModalEdit}
        deleteLoading={isPending}
        deleteAction = {handleDeleteAction}
      />

      {/* Delete */}
      <ConfirmationModal
        message={STRING_DATA.MESSAGE_PROCEED}
        openModal={openModalDelete}
        actionLabel={"Delete"}
        hideModal={closeDeleteModal}
        onActionClick={handleDeleteAction}
        loading={isLoadingDelete}
      />

      <div className="common-list-section-class my-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="custom-h2-class">{STRING_DATA.YOUR_LIST}</div>
            <ActionButton text="Add list" onclick={showModal} />
          </div>
          {renderData()}
        </div>
      </div>
    </>
  );
};

export default ManageListComp;
