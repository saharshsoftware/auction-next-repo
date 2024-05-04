import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleOnSettled } from "@/shared/Utilies";
import { createFavouriteList } from "@/server/actions/favouriteList";
import { createFavouriteListClient } from "@/services/favouriteList";
import LoginComp from "../templates/LoginComp";

interface ILoginModal {
  openModal: boolean;
  hideModal?: () => void;
}

const LoginModal = (props: ILoginModal) => {
  const { openModal, hideModal = () => {} } = props;
  const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: createFavouriteListClient,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [REACT_QUERY.FAVOURITE_LIST],
          });
          // router.push(ROUTE_CONSTANTS.DASHBOARD);
          hideModal?.();
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const handleFavlist = (values: { name: string }) => {
    const body = {
      name: values?.name,
    };
    mutate(body);
  };
  return (
    <>
      <CustomModal
        openModal={openModal}
        modalHeading={STRING_DATA.LOGIN}
        customWidthClass="md:w-[40%] sm:w-3/5 w-11/12"
      >
       <LoginComp /> 
      </CustomModal>
    </>
  );
};

export default LoginModal;
