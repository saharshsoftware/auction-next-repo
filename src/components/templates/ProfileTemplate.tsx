"use client";
import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import { STRING_DATA } from "@/shared/Constants";
import DeleteUserConfirmationModal from "../ modals/DeleteUserConfirmationModal";
import useModal from "@/hooks/useModal";
import UpdatePasswordModal from "../ modals/UpdatePasswordModal";
import EditProfileModal from "../ modals/EditProfileModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import FallbackLoading from "../atoms/FallbackLoading";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProfileTemplate() {
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

  const { userProfileData: userData, isLoading, error, refetch: refetchUserProfile } = useUserProfile();

  const renderUserProfile = () => {
    if (isLoading) {
      return <FallbackLoading />;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <div className="flex flex-col gap-4">
        <div>
          <div className="custom-common-header-class">
            <div className="flex items-center justify-between gap-2">
              <div className="text-white">
                {STRING_DATA.PROFILE}
              </div>
              <div className="text-white text-sm font-bold cursor-pointer" onClick={showModalEdit}>
                <FontAwesomeIcon icon={faEdit} size="lg" />
              </div>
            </div>
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
              <ShowLabelValue
                heading={"Interested Cities"}
                value={userData?.interestedCities ?? "-"}
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
    )
  }

  return (
    <>
      {/* Delete User*/}
      {openModalDelete && (
        <DeleteUserConfirmationModal
          openModal={openModalDelete}
          hideModal={hideModalDelete}
        />
      )}

      {/* Edit Profile */}
      {openModalEdit && (
        <EditProfileModal
          openModal={openModalEdit}
          hideModal={hideModalEdit}
          currentInterestedCities={userData?.interestedCities}
          refetchUserProfile={refetchUserProfile}
        />
      )}

      {/* Update Password */}
      <UpdatePasswordModal openModal={openModal} hideModal={hideModal} />
      
      {/* Delete User */}
      {openModalDelete && (
        <DeleteUserConfirmationModal
          openModal={openModalDelete}
          hideModal={hideModalDelete}
        />
      )}
      
      {renderUserProfile()}
    </>
  );
}
