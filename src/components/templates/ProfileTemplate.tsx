"use client";
import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import { STRING_DATA } from "@/shared/Constants";
import DeleteUserConfirmationModal from "../ modals/DeleteUserConfirmationModal";
import useModal from "@/hooks/useModal";
import UpdatePasswordModal from "../ modals/UpdatePasswordModal";
import EditProfileModal from "../ modals/EditProfileModal";
import { useUserProfile } from "@/hooks/useUserProfile";
import FallbackLoading from "../atoms/FallbackLoading";
import { faEdit, faUser, faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { USER_TYPE } from "@/types.d";
import BudgetRangePills from "../atoms/BudgetRangePills";
import ProfileMembershipSection from "@/components/ui/ProfileMembershipSection";
import { useState } from "react";
import { useIsAuthenticated } from "@/hooks/useAuthenticated";

type TabType = "profile" | "membership";

export default function ProfileTemplate() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { isAuthenticated } = useIsAuthenticated();
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

  const { userProfileData: userData, isLoading, error, refetch: refetchUserProfile } = useUserProfile(isAuthenticated);

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

  const renderTabNavigation = () => (
    <div className="flex border-b border-gray-200 bg-white rounded-t-2xl overflow-x-auto">
      <button
        onClick={() => setActiveTab("profile")}
        className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap min-w-0 flex-shrink-0 ${
          activeTab === "profile"
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        }`}
      >
        <FontAwesomeIcon icon={faUser} size="sm" />
        <span className="hidden xs:inline">Profile Information</span>
        <span className="xs:hidden">Profile</span>
      </button>
      <button
        onClick={() => setActiveTab("membership")}
        className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap min-w-0 flex-shrink-0 ${
          activeTab === "membership"
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        }`}
      >
        <FontAwesomeIcon icon={faCrown} size="sm" />
        <span className="hidden xs:inline">Membership Details</span>
        <span className="xs:hidden">Membership</span>
      </button>
    </div>
  );

  const renderProfileContent = () => (
    <div className="bg-white rounded-b-2xl shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h2>
          <button
            onClick={showModalEdit}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto"
          >
            <FontAwesomeIcon icon={faEdit} size="sm" />
            <span>Edit Profile</span>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 sm:gap-6">
            <div className="space-y-4">
              <ShowLabelValue
                heading={"Full Name"}
                value={userData?.name ?? "-"}
              />
              <ShowLabelValue
                heading={"Email"}
                value={userData?.email ?? "-"}
              />
              <ShowLabelValue
                heading={"Phone Number"}
                value={userData?.username ?? "-"}
              />
            </div>
            
            <div className="space-y-4">
              <ShowLabelValue
                heading={"Interested Cities"}
                value={userData?.interestedCities || "-"}
              />
              <ShowLabelValue
                heading={"Interested Categories"}
                value={userData?.interestedCategories || "-"}
              />
              <ShowLabelValue
                heading={"User Type"}
                hasChildren={true}
              >
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    userData?.userType === USER_TYPE.BROKER ? 'bg-purple-100 text-purple-800' :
                    userData?.userType === USER_TYPE.INVESTOR ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {renderUserType(userData?.userType)}
                  </span>
                </div>
              </ShowLabelValue>
            </div>
          </div>
          
          {/* Budget Ranges */}
          <div className="pt-4 border-t border-gray-100">
            <ShowLabelValue heading={"Budget Ranges"} hasChildren={true}>
              <BudgetRangePills budgetRanges={userData?.budgetRanges} />
            </ShowLabelValue>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={showModal}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
          >
            {STRING_DATA.UPDATE_PASSWORD}
          </button>
          <button
            onClick={showModalDelete}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-center"
          >
            {STRING_DATA.DELETE_ACCOUNT}
          </button>
        </div>
      </div>
    </div>
  );

  const renderMembershipContent = () => (
    <div className="bg-white rounded-b-2xl shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Membership Details</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your current membership plan, billing preferences, and payment history.
          </p>
        </div>
        <ProfileMembershipSection refetchUserProfile={refetchUserProfile} />
      </div>
    </div>
  );

  const renderUserProfile = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-96">
          <FallbackLoading />
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4">
          <div className="text-red-800 text-center">Error: {error.message}</div>
        </div>
      );
    }

    return (
      <div className="w-full  mx-auto py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your profile information and membership details.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {renderTabNavigation()}
          {activeTab === "profile" ? renderProfileContent() : renderMembershipContent()}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Modals */}
      {openModalDelete && (
        <DeleteUserConfirmationModal
          openModal={openModalDelete}
          hideModal={hideModalDelete}
        />
      )}

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

      <UpdatePasswordModal openModal={openModal} hideModal={hideModal} />
      
      <div className="">
        {renderUserProfile()}
      </div>
    </>
  );
}
