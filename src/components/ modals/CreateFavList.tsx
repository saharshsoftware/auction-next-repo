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
import { useRouter } from "next/navigation";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

interface ICreateFavList {
  openModal: boolean;
  hideModal?: ()=> void;
  isHowToCreateRoute?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required(ERROR_MESSAGE.NAME_REQUIRED),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
};

const CreateFavList = (props: ICreateFavList) => {
  const { openModal, hideModal=()=>{}, isHowToCreateRoute = false } = props;
  const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");
  const router = useRouter();
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
          if (isHowToCreateRoute) {
            router.push(ROUTE_CONSTANTS.MANAGE_LIST);
          }
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

  const handleFavlist = (values:{name: string}) => {
    const body = {
      name: values?.name
    }
    mutate(body);
  };
  return (
    <>
      <CustomModal
        openModal={openModal}
        modalHeading={STRING_DATA.ADD_COLLECTION}
        customWidthClass="md:w-[40%] sm:w-3/5 w-11/12"
      >
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <CustomFormikForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleSubmit={handleFavlist}
            >
              <div className="flex flex-col gap-4 ">
                <TextField
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                />
                {respError ? (
                  <span className="text-center text-sm text-red-700">
                    {respError}
                  </span>
                ) : null}
                <div className="flex justify-end items-center gap-4">
                  <ActionButton
                    text="Close"
                    onclick={hideModal}
                    isActionButton={false}
                  />
                  <ActionButton
                    isSubmit={true}
                    text="Add"
                    isLoading={isPending}
                  />
                </div>
              </div>
            </CustomFormikForm>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default CreateFavList;
