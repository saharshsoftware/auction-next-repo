import React, { useEffect, useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { COOKIES, ERROR_MESSAGE, REACT_QUERY, STRING_DATA } from "@/shared/Constants";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleOnSettled } from "@/shared/Utilies";
import { createFavouriteList } from "@/server/actions/favouriteList";
import { createFavouriteListClient } from "@/services/favouriteList";
import LoginComp from "../templates/LoginComp";
import SignupComp from "../templates/SignupComp";
import { getCookie } from "cookies-next";
import ActionCheckbox from "../atoms/ActionCheckbox";
import { ErrorMessage, Field, Form } from "formik";

interface IInterestModal {
  openModal: boolean;
  hideModal?: () => void;
  userData?: any;
}

const validationSchema = Yup.object({
  check1: Yup.bool().oneOf([true], "You must agree to the terms"),
  check2: Yup.bool().oneOf([true], "You must agree to the terms"),
});

const InterestModal = (props: IInterestModal) => {
  const { openModal, hideModal = () => {}, userData } = props;
  const [show, setShow] = useState({ login: true, signup: false });
    const token = getCookie(COOKIES.TOKEN_KEY) ?? "";

    const [myToken, setMyToken] = useState("");

    useEffect(() => {
      // console.log(token);
      setMyToken(token);
    }, [token]);

  const handleShowLogin = () => {
    setShow({ login: true, signup: false })
  };
  
  const handleShowRegister = () => {
    setShow({ login: false, signup: true })
  };
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

  const renderAuthComponent = () => {
    if (show?.login) {
      return (
        <LoginComp isAuthModal={true} handleLinkclick={handleShowRegister} closeModal={hideModal}/>
      );
    }
    if (show?.signup) {
      return (
        <SignupComp
          isAuthModal={true}
          handleLinkclick={handleShowLogin}
          closeModal={hideModal}
        />
      );
    }
  }

  const selectedHeading = () => {
    let heading = STRING_DATA.SHOW_INTEREST;
    if (show?.login && !myToken) {
      heading = STRING_DATA.LOGIN;
    }
    if (show?.signup && !myToken) {
      heading = STRING_DATA.REGISTER;
    }
    return heading
  }

  const getIPAddress = async () => {
    try {
      // Get user's IP address using ipify
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ipAddress = data.ip;
      return ipAddress
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  }

  const handleInterestRequest = async () => {
    const ip = await getIPAddress();
    console.log("handleInterestRequest", ip);
  };


  const renderer = () => {
    console.log(myToken, "myTokeningereste");
    if (myToken) {
      return (
        <>
          <CustomFormikForm
            initialValues={{
              check1: false,
              check2: false,
              name: userData?.name,
              email: userData?.email,
              phone: userData?.username,
            }}
            validationSchema={validationSchema}
            handleSubmit={handleInterestRequest}
            wantToUseFormikEvent={true}
            enableReinitialize={true}
          >
            {({ values, setFieldValue }: any) => (
              <Form>
                {/* {JSON.stringify(values)} */}
                <div className="flex flex-col gap-4 ">
                  <TextField
                    value={values?.name}
                    type="text"
                    name="name"
                    label="Name"
                    disabled={true}
                  />
                  <TextField
                    value={values?.email}
                    type="text"
                    name="email"
                    label="Email"
                    disabled={true}
                  />
                  <TextField
                    value={values?.phone}
                    type="text"
                    name="phone"
                    label="Contact number"
                    disabled={true}
                  />
                  <div className="flex flex-col gap-2 w-full items-start relative">
                    <div className="flex gap-2 w-full items-start justify-start relative">
                      <Field
                        type="checkbox"
                        name="check1"
                        className="mt-1"
                        id="check1"
                      />
                      <label
                        className={`flex justify-between items-center w-full cursor-pointer`}
                        htmlFor="check1"
                      >
                        <span className="text-sm text-gray-900">
                          I hereby express interest to purchase the above
                          property. I provide consent to e-auctiondekho to share
                          the above details with the respective bank/financial
                          institution and required intermediaries to pursue this
                          further.
                        </span>
                      </label>
                    </div>
                    <ErrorMessage
                      name={"check1"}
                      component={"div"}
                      className="text-sm text-error"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full items-start relative">
                    <div className="flex gap-2 w-full items-start justify-start relative">
                      <Field
                        type="checkbox"
                        name="check2"
                        className="mt-1"
                        id="check2"
                      />
                      <label
                        className={`flex justify-between items-center w-full cursor-pointer`}
                        htmlFor="check2"
                      >
                        <span className="text-sm text-gray-900">
                          I allow e-auctiondekho to send message on whatsapp
                        </span>
                      </label>
                    </div>
                    <ErrorMessage
                      name={"check2"}
                      component={"div"}
                      className="text-sm text-error"
                    />
                  </div>

                  {respError ? (
                    <span className="text-center text-sm text-red-700">
                      {respError}
                    </span>
                  ) : null}
                  <div className="flex justify-end items-center gap-4">
                    <ActionButton
                      text={STRING_DATA.CANCEL.toUpperCase()}
                      onclick={hideModal}
                      isActionButton={false}
                    />
                    <ActionButton
                      text={STRING_DATA.SUBMIT.toUpperCase()}
                      isSubmit={true}
                      isLoading={isPending}
                    />
                  </div>
                </div>
              </Form>
            )}
          </CustomFormikForm>
        </>
      );
    }
    else {
      return renderAuthComponent();
    }
  }

  return (
    <>
      <CustomModal
        openModal={openModal}
        modalHeading={selectedHeading()}
        customWidthClass="md:w-[40%] sm:w-3/5 w-11/12"
      >
        <div className="w-full">{renderer()}</div>
      </CustomModal>
    </>
  );
};

export default InterestModal;