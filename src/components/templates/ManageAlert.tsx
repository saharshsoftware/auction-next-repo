"use client"
import { REACT_QUERY, STRING_DATA } from '@/shared/Constants';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import React, { useState } from 'react'
import ActionButton from '../atoms/ActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { faAdd, faPencil, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { deleteAlert, fetchAlerts } from '@/services/auction';
import { IAlert } from '@/types';
import CreateAlert from '../ modals/CreateAlert';
import useModal from '@/hooks/useModal';
import ConfirmationModal from '../ modals/ConfirmationModal';
import { handleOnSettled } from '@/shared/Utilies';
import EditAlert from '../ modals/EditAlert';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ManageAlert = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedData, setSelectedData] = useState<IAlert>();
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

  const handleDeleteModal = (data: any) => {
    console.log(data);
    showModalDelete();
    setSelectedData(data);
  };

  const handleEditModal = (data: any) => {
    console.log(data);
    showModalEdit();
    setSelectedData(data);
  };

  const closeDeleteModal = () => {
    setSelectedData(undefined);
    hideModalDelete();
  };

  const { data: dataAlert, fetchStatus } = useQuery({
    queryKey: [REACT_QUERY.ALERTS],
    queryFn: async () => {
      const res = (await fetchAlerts()) as unknown as IAlert[];
      // console.log(result, "fetchinalert");
      return res ?? [];
    },
  });

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: deleteAlert,
    onSettled: async (data) => {
      console.log(data);
      hideModalDelete();
      const response = {
        data,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [REACT_QUERY.ALERTS],
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

    const handleDeleteAction = () => {
      // refetch();

      mutate({ id: selectedData?.id ?? "" });
    };

  const renderData = () => {
    if (fetchStatus === "fetching") {
      return <div className="text-center">Loading ...</div>;
    }

    if (dataAlert?.length === 0) {
      return (
        <div className="text-center break-all">
          {STRING_DATA.NO_ALERT_FOUND}
        </div>
      );
    }
    return (
      <>
        <div className="flex flex-col gap-4 w-full">
          {dataAlert?.map((item: IAlert, index: number) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full border border-brand-color shadow px-4 py-3 rounded-lg"
            >
              {/* Alert Name - Full width on mobile, flexible on desktop */}
              <Link
                href={`${ROUTE_CONSTANTS.MANAGE_ALERT}/${item.id}`}
                className="flex-1 min-w-0 hover:text-brand-color transition-colors cursor-pointer"
              >
                <span className="break-words">
                  {item?.name}
                </span>
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 flex-shrink-0">
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
      {/* Create alert Modal */}
      {openModal ? (
        <CreateAlert openModal={openModal} hideModal={hideModal} />
      ) : null}

      {/* Update alert Modal */}
      <EditAlert
        fieldata={selectedData}
        openModal={openModalEdit}
        hideModal={hideModalEdit}
        deleteLoading={isPending}
        deleteAction={handleDeleteAction}
      />

      {/* Delete */}
      <ConfirmationModal
        message={STRING_DATA.DELETE_ALERT_MESSAGE}
        openModal={openModalDelete}
        actionLabel={STRING_DATA.DELETE}
        hideModal={closeDeleteModal}
        onActionClick={handleDeleteAction}
        loading={isPending}
      />

      <div className="common-list-section-class my-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
            <h2 className="custom-h2-class">{STRING_DATA.YOUR_ALERTS}</h2>
            <ActionButton
              text="Add alert"
              onclick={showModal}
              icon={<FontAwesomeIcon icon={faAdd} />}
            />
          </div>
          {renderData()}
        </div>
      </div>
    </>
  );
}

export default ManageAlert