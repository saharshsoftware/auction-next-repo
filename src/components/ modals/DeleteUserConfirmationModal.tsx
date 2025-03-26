import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { STRING_DATA } from "@/shared/Constants";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import { deleteUserAccount } from "@/services/auth";
import { logout } from "@/server/actions";
import { useRouter } from "next/navigation";

interface IDeleteUserConfirmationModal {
  openModal: boolean;
  hideModal: () => void;
}

const DeleteUserConfirmationModal: React.FC<IDeleteUserConfirmationModal> = (
  props
) => {
  const { openModal, hideModal = () => {} } = props;
  const router = useRouter();
  const [respError, setRespError] = useState<string>("");

  const { mutate: mutateDelete, isPending: isLoadingDeletePassword } =
    useMutation({
      mutationFn: deleteUserAccount,
      onSuccess() {
        router.push("/");
        logout();
      },
      onError(error) {
        console.log(error);
        setRespError(error?.message);
      },
    });

  const deleteUserRequest = () => {
    // DELETE USER API CALL
    console.log("Delete api call");
    mutateDelete();
  };

  return (
    <CustomModal
      openModal={openModal}
      modalHeading={"Permanently Delete User"}
      customWidthClass="md:w-[50%] sm:w-3/5 w-11/12"
    >
      <div className="flex flex-col gap-2">
        <p className="text-left">
          {
            "This will permanently delete the user from the database. This action cannot be undone. Are you sure you want to continue?"
          }
        </p>
        <CustomFormikForm
          initialValues={{ name: STRING_DATA.EMPTY }}
          wantToUseFormikEvent={true}
          handleSubmit={deleteUserRequest}
        >
          {({ values }: any) => (
            <Form>
              <div className="flex flex-col gap-4 ">
                <TextField
                  type="text"
                  name="name"
                  placeholder="Type 'DELETE' to confirm"
                />
                {respError ? (
                  <span className="text-center text-sm text-red-700">
                    {respError}
                  </span>
                ) : null}
                <div className="flex justify-end items-center">
                  <div className="flex justify-end items-center gap-4">
                    <ActionButton
                      text={"Cancel"}
                      onclick={hideModal}
                      customClass="btn btn-sm"
                      isActionButton={false}
                    />

                    <ActionButton
                      text={STRING_DATA.DELETE}
                      isLoading={isLoadingDeletePassword}
                      isSubmit={true}
                      disabled={values?.name !== "DELETE"}
                      isDeleteButton={true}
                      customClass="btn btn-sm h-full min-w-24"
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </CustomFormikForm>
      </div>
    </CustomModal>
  );
};

export default DeleteUserConfirmationModal;
