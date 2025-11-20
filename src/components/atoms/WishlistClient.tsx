"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import { useMutation } from "@tanstack/react-query";
import { handleOnSettled } from "@/shared/Utilies";
import ActionButton from "../atoms/ActionButton";
import { addPropertyToFavouriteListClient } from "@/services/favouriteList";
import toast from "react-simple-toasts";
import CustomModal from "../atoms/CustomModal";

import useModal from "@/hooks/useModal";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import LoginComp from "../templates/LoginComp";

const WishlistClient = ({
  auctionData,
  favouriteListData,
  isAuthenticated,
}: any) => {
  const {
    showModal: showModalLogin,
    openModal: openModalLogin,
    hideModal: hideModalLogin,
  } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [respError, setRespError] = useState<string>("");

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: addPropertyToFavouriteListClient,
    onSettled: async (data) => {
      const response = {
        data,
        success: () => {
          setRespError("");
          setSelectedOption(null);
          toast("Successfully Added", {
            theme: "success",
            position: "top-center",
          });
        },
        fail: (error: any) => {
          toast(error.message, {
            theme: "failure",
            position: "top-center",
          });
          setSelectedOption(null);
        },
      };
      handleOnSettled(response);
    },
  });

  const addPropertyToFavourite = () => {
    const body = {
      listId: selectedOption?.value ?? "",
      propertyId: Number(auctionData?.id) ?? "",
    };
    mutate(body);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!isAuthenticated) {
      showModalLogin();
      return;
    }
    if (!selectedOption) {
      setRespError("Please select a collection");
      return;
    }
    addPropertyToFavourite();
  };

  const renderDropdown = () => {
    if (!mounted) {
      return (
        <>
          <div className="w-full min-h-[38px] border border-gray-400 rounded px-3 flex items-center justify-between bg-white">
            <span className="text-gray-400">Select collection</span>
            <div className="flex items-center h-[20px]">
              {/* Ensure it's block */}
              <span>
                <svg
                  height="20"
                  width="20"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  focusable="false"
                  fill="#ccc"
                  className="w-5 h-5"
                >
                  <path
                    fill="#ccc"
                    d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </>
      );
    }
    return (
      <Select
        className="w-full"
        placeholder="Select collection"
        name="wishlist"
        value={selectedOption}
        onChange={setSelectedOption}
        options={isAuthenticated ? favouriteListData : []}
        isDisabled={!isAuthenticated}
      />
    );
  };

  return (
    <>
      {openModalLogin && (
        <CustomModal
          openModal={openModalLogin}
          modalHeading={STRING_DATA.LOGIN}
          customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12"
        >
          <div className="w-full">
            <LoginComp isAuthModal={true} closeModal={hideModalLogin} />
          </div>
        </CustomModal>
      )}
      {favouriteListData?.length === 0 ? (
        <Link
          href={ROUTE_CONSTANTS.MANAGE_LIST}
          className="link link-primary text-center"
        >
          Create your list
        </Link>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          {renderDropdown()}
          {respError && (
            <span className="text-center text-sm text-red-700">
              {respError}
            </span>
          )}

          <ActionButton
            isSubmit={true}
            text="Add"
            isLoading={isPending}
            disabled={isPending}
            customClass="w-full"
          />
        </form>
      )}
    </>
  );
};

export default WishlistClient;
