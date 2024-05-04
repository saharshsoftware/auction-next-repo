import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleOnSettled } from "@/shared/Utilies";
import { updateFavouriteList } from "@/server/actions/favouriteList";
import { Form } from "formik";
import { updateFavouriteListClient } from "@/services/favouriteList";

interface ICreateFavList {
  openModal: boolean;
  fieldata: any;
  hideModal?: () => void;
  deleteLoading?: boolean;
  deleteAction?: () => void;
}

const validationSchema = Yup.object({
  list_name: Yup.string().trim().required(ERROR_MESSAGE.NAME_REQUIRED),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
};

const EditFavList = (props: ICreateFavList) => {
  const { openModal, hideModal = () => {}, fieldata, deleteAction, deleteLoading } = props;
  const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: updateFavouriteListClient,
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

  const handleFavlist = (values: { list_name: string }) => {
    const body = {
      name: values?.list_name,
    };
    const payload = {
      body,
      id: fieldata?.id,
    };
    console.log(payload);
    mutate(payload);
  };
  return (
    <>
      <CustomModal
        openModal={openModal}
        modalHeading={STRING_DATA.EDIT_LIST}
        customWidthClass="md:w-[40%] sm:w-3/5 w-11/12"
      >
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <CustomFormikForm
              initialValues={{ list_name: fieldata?.name }}
              validationSchema={validationSchema}
              handleSubmit={handleFavlist}
              wantToUseFormikEvent={true}
            >
              {({ values }: any) => (
                <Form>
                  <div className="flex flex-col gap-4 ">
                    <TextField
                      type="text"
                      name="list_name"
                      label="Name"
                      value={values?.list_name}
                      placeholder="Enter name"
                    />
                    {respError ? (
                      <span className="text-center text-sm text-red-700">
                        {respError}
                      </span>
                    ) : null}

                    <div className="flex justify-end items-center gap-4 flex-wrap">
                      <ActionButton
                        text="Close"
                        onclick={hideModal}
                        isActionButton={false}
                      />
                      <ActionButton
                        isSubmit={true}
                        text="Update"
                        isLoading={isPending}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </CustomFormikForm>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default EditFavList;
