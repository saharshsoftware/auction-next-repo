import React from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { STRING_DATA } from "@/shared/Constants";
import TextField from "../atoms/TextField";
import CustomFormikForm from "../atoms/CustomFormikForm";
import { Form } from "formik";

interface IDeleteUserConfirmationModal {
  openModal: boolean;
  hideModal: () => void;
}

const DeleteUserConfirmationModal: React.FC<IDeleteUserConfirmationModal> = (props) => {
  const {
    openModal,
    hideModal = () => {},
  } = props;

  const deleteUserRequest = () => {
    // DELETE USER API CALL
    console.log("Delete api call")
  }

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
                      // isLoading={loading}
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
