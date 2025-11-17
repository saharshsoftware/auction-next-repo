import React, { useState } from "react";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import CustomModal from "../atoms/CustomModal";
import { ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import * as Yup from "yup";
import ActionButton from "../atoms/ActionButton";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSavedSearch } from "@/services/auction";
import { handleOnSettled } from "@/shared/Utilies";
import toast from "react-simple-toasts";

interface ISavedSearchModal {
  openModal: boolean;
  hideModal?: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required(ERROR_MESSAGE.NAME_REQUIRED),
});

const initialValues = {
  name: STRING_DATA.EMPTY,
};

const SavedSearchModal = (props: ISavedSearchModal) => {
  const { openModal, hideModal = () => {} } = props;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [respError, setRespError] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: createSavedSearch,
    onSettled: async (data) => {
      const response = {
        data,
        success: () => {
          setRespError("");
          hideModal();
          toast("Successfully saved", {
            theme: "success",
            position: "top-center",
          });
          queryClient.invalidateQueries({ queryKey: [REACT_QUERY.SAVED_SEARCH] });
        },
        fail: (error: any) => {
          const { message } = error;
          setRespError(message);
        },
      };
      handleOnSettled(response);
    },
  });

  const handleSaved = (values: any) => {
    console.log(values, searchParams.get("q"));
    const formData = {
      name: values?.name,
      filter: searchParams.get("q") ?? "",
    };
    mutate({ formData });
  };

  return (
    <>
      <CustomModal
        openModal={openModal}
        modalHeading={"Save your search"}
        customWidthClass="md:w-[40%] sm:w-3/5 w-11/12"
      >
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <CustomFormikForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleSubmit={handleSaved}
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
                    text={STRING_DATA.SAVE}
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

export default SavedSearchModal;
