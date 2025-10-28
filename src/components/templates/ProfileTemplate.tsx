"use client";
import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import { STRING_DATA, BUDGET_RANGES } from "@/shared/Constants";
import DeleteUserConfirmationModal from "../ modals/DeleteUserConfirmationModal";
import useModal from "@/hooks/useModal";
import UpdatePasswordModal from "../ modals/UpdatePasswordModal";
import EditProfileModal from "../ modals/EditProfileModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import FallbackLoading from "../atoms/FallbackLoading";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { USER_TYPE } from "@/types.d";
import { normalizeBudgetRanges, formatPrice } from "@/shared/Utilies";

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

  const renderUserType = (userType: USER_TYPE | undefined) => {
    if (userType === USER_TYPE.INDIVIDUAL) {
      return STRING_DATA.INDIVIDUAL;
    }
    if (userType === USER_TYPE.INVESTOR) {
      return STRING_DATA.INVESTOR;
    }
    if (userType === USER_TYPE.BROKER) {
      return STRING_DATA.BROKER;
    }
    return "-";
  }

  const renderUserProfile = () => {
    if (isLoading) {
      return <FallbackLoading />;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    }

    const renderBudgetRangePills = () => {
      const normalized = normalizeBudgetRanges(userData?.budgetRanges);
      if (!normalized || normalized.length === 0) {
        return <div className="text-gray-600">-</div>;
      }

      return (
        <div className="flex flex-wrap gap-2">
          {normalized.map((r, idx) => {
            return (
              <span key={`budget-chip-${idx}`} className="px-2 py-0.5 rounded-full border border-primary text-primary text-sm">
                {`₹${(r.min)} - ₹${(r.max)}`}
              </span>
            );
          })}
        </div>
      );
    };

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
                value={userData?.interestedCities || "-"}
              />
              <ShowLabelValue
                heading={"Interested Categories"}
                value={userData?.interestedCategories || "-"}
              />
              <ShowLabelValue heading={"Budget Ranges"} hasChildren={true}>
                {renderBudgetRangePills()}
              </ShowLabelValue>
              <ShowLabelValue
                heading={"User Type"}
                hasChildren={true}
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-700">
                    {renderUserType(userData?.userType)}
                  </div>
                </div>
              </ShowLabelValue>
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
          currentInterestedCategories={userData?.interestedCategories}
          currentUserType={userData?.userType}
          budgetRanges={userData?.budgetRanges}
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
