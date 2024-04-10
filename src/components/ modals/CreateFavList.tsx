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

interface ICreateFavList {
  openModal: boolean;
  hideModal?: ()=> void;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required(ERROR_MESSAGE.NAME_REQUIRED),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
};

const CreateFavList = (props: ICreateFavList) => {
  const { openModal, hideModal=()=>{} } = props;
  const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: createFavouriteList,
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
        customWidthClass="md:w-[40%] sm:w-3/5 w-11/12"
      >
        <div className="w-full p-2">
          <div className="flex flex-col gap-4">
            <CustomFormikForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleSubmit={handleFavlist}
            >
              <div className="flex flex-col gap-4 ">
                <h2 className="custom-h2-class text-center text-3xl">
                  {STRING_DATA.ADD}
                </h2>
                <TextField
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                />
              </div>
            </CustomFormikForm>
            {respError ? (
              <span className="text-center text-sm text-red-700">
                {respError}
              </span>
            ) : null}
            <div className="flex justify-end items-center gap-4">
              <ActionButton isSubmit={true} text="Add" isLoading={isPending} />
              <ActionButton
                text="Close"
                onclick={hideModal}
                isActionButton={false}
              />
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default CreateFavList;
