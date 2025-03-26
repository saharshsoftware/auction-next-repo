"use client";
// import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import dynamic from "next/dynamic";
const ShowLabelValue = dynamic(
  () => import("@/components/atoms/ShowLabelValue"),
  {
    ssr: false,
  }
);
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import ActionButton from "../atoms/ActionButton";
import DeleteUserConfirmationModal from "../ modals/DeleteUserConfirmationModal";
import useModal from "@/hooks/useModal";
import UpdatePasswordModal from "../ modals/UpdatePasswordModal";

export default function ProfileTemplate() {
  const { showModal, openModal, hideModal } = useModal();
  const {
    showModal: showModalDelete,
    openModal: openModalDelete,
    hideModal: hideModalDelete,
  } = useModal();

  const userData = getCookie(COOKIES.AUCTION_USER_KEY)
    ? JSON.parse(getCookie(COOKIES.AUCTION_USER_KEY) ?? "")
    : null;

  return (
    <>
      {/* Delete User*/}
      {openModalDelete && (
        <DeleteUserConfirmationModal
          openModal={openModalDelete}
          hideModal={hideModalDelete}
        />
      )}

      {/* Delete User*/}
      <UpdatePasswordModal openModal={openModal} hideModal={hideModal} />
      <div className="flex flex-col gap-4">
        <div>
          <div className="custom-common-header-class">
            {STRING_DATA.PROFILE}
          </div>
          <div className="custom-common-header-detail-class">
            <div className="flex flex-col gap-4 p-4  w-full min-h-12">
              <ShowLabelValue
                heading={"Full Name"}
                value={userData?.name ?? "-"}
              />
              <ShowLabelValue
                heading={"Email"}
                value={userData?.email ?? "-"}
              />
              <ShowLabelValue
                heading={"Phone number"}
                value={userData?.username ?? "-"}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div onClick={showModal} className=" link link-primary">
            {STRING_DATA.UPDATE_PASSWORD.toUpperCase()}
          </div>
          <div onClick={showModalDelete} className=" link link-error">
            {STRING_DATA.DELETE_ACCOUNT.toUpperCase()}
          </div>
        </div>
      </div>
    </>
  );
}
