"use client";

import useModal from "@/hooks/useModal";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";
import ActionButton from "../atoms/ActionButton";
import LoginModal from "./LoginModal";
import CreateFavList from "./CreateFavList";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import Link from "next/link";
import { fetchFavoriteListClient } from "@/services/favouriteList";
import { IFavouriteList } from "@/types";
import { REACT_QUERY } from "@/shared/Constants";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/useUserProfile";

function LoginToCreateCollection({
  isAuthenticated,
  isHowToCreateRoute = false,
}: {
  isAuthenticated?: boolean;
  isHowToCreateRoute?: boolean;
}) {
  const { showModal, openModal, hideModal } = useModal();
  const router = useRouter();
  const { isInternalUser } = useUserProfile(Boolean(isAuthenticated));

  const {
    data: favouriteListData,
  } = useQuery({
    queryKey: [REACT_QUERY.FAVOURITE_LIST],
    queryFn: async () => {
      const res =
        (await fetchFavoriteListClient()) as unknown as IFavouriteList[];
      return res ?? [];
    },
    staleTime: 0,
    enabled: isAuthenticated,
  });

  const { canAddCollection, isLoading: isLoadingAccess } = useSubscriptionAccess({
    collections: favouriteListData?.length ?? 0
  });

  const handleCloseCreateFavList = () => {
    hideModal();
    router.refresh();
  };

  const renderModalContainer = () => {
    if (isAuthenticated) {
      return (
        <CreateFavList
          openModal={openModal}
          hideModal={handleCloseCreateFavList}
          isHowToCreateRoute={isHowToCreateRoute}
        />
      );
    }
    return (
      <LoginModal openModal={openModal} hideModal={handleCloseCreateFavList} />
    );
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "Signup to create collection";
    if (isLoadingAccess) return "Loading...";
    if (!canAddCollection) return "Limit reached";
    return "Create Collection";
  };

  const shouldDisableButton = isAuthenticated && (!canAddCollection || isLoadingAccess);

  return (
    <>
      <ActionButton
        text={getButtonText()}
        onclick={shouldDisableButton ? undefined : showModal}
        disabled={shouldDisableButton}
        iconLeft={<FontAwesomeIcon icon={faBell} className="h-4 w-4 " />}
      />
      {shouldDisableButton && isAuthenticated && !isLoadingAccess && isInternalUser && (
        <div className="mt-2 text-xs text-gray-600">
          <Link href="/pricing" className="text-blue-600 hover:underline">
            Upgrade your plan
          </Link> to create more collections
        </div>
      )}
      {openModal ? renderModalContainer() : null}
    </>
  );
}

export default LoginToCreateCollection;
