"use client";

import useModal from "@/hooks/useModal";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";
import ActionButton from "../atoms/ActionButton";
import CreateAlert from "./CreateAlert";
import LoginModal from "./LoginModal";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "@/services/auction";
import { REACT_QUERY } from "@/shared/Constants";
import { IAlert } from "@/types";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LimitReachedBanner } from "../molecules/limit-reached-banner";

function LoginToCreateAlert({
  isAuthenticated,
  isHowToCreateRoute = false,
}: {
  isAuthenticated?: boolean;
  isHowToCreateRoute?: boolean;
}) {
  const { showModal, openModal, hideModal } = useModal();
  const router = useRouter();
  const { isInternalUser } = useUserProfile(Boolean(isAuthenticated));


  const { data: dataAlert } = useQuery({
    queryKey: [REACT_QUERY.ALERTS],
    queryFn: async () => {
      const res = (await fetchAlerts()) as unknown as IAlert[];
      return res ?? [];
    },
    enabled: isAuthenticated,
  });

  const { canAddAlert, isLoading: isLoadingAccess } = useSubscriptionAccess({
    alerts: dataAlert?.length ?? 0
  });

  const handleCloseCreateAlert = () => {
    hideModal();
    router.refresh();
  };

  const renderModalContainer = () => {
    if (isAuthenticated) {
      return (
        <CreateAlert openModal={openModal} hideModal={handleCloseCreateAlert} isHowToCreateRoute={isHowToCreateRoute} />
      );
    }
    return (
      <LoginModal openModal={openModal} hideModal={handleCloseCreateAlert} />
    );
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "Signup to create alert";
    if (isLoadingAccess) return "Loading...";
    return "Create Alert";
  };

  const shouldDisableButton = isAuthenticated && (isLoadingAccess);

  const renderActionButton = () => {
    if (!canAddAlert && isAuthenticated) {
      return null
    } else {
      return (
        <ActionButton
          text={getButtonText()}
          onclick={shouldDisableButton ? undefined : showModal}
          disabled={shouldDisableButton}
          iconLeft={<FontAwesomeIcon icon={faBell} className="h-4 w-4 " />}
        />
      );
    }
  };

  return (
    <>
      {renderActionButton()}
      {!canAddAlert && !isLoadingAccess && isInternalUser && (
        <LimitReachedBanner featureType="alerts" className="mt-4" featureName="alerts" />
      )}
      {openModal ? renderModalContainer() : null}
    </>
  );
}

export default LoginToCreateAlert;
