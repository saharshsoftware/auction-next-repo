import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import ActionButton from "../atoms/ActionButton";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import CustomFormikForm from "../atoms/CustomFormikForm";
import TextField from "../atoms/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleOnSettled } from "@/shared/Utilies";
import LoginComp from "../templates/LoginComp";
import SignupComp from "../templates/SignupComp";
import { getCookie } from "cookies-next";
import { Field, Form } from "formik";
import { showInterest } from "@/services/auction";
import toast from "react-simple-toasts";
import { IAuction } from "@/types";
import WhatsappSvg from "../svgIcons/WhatsappSvg";
import { useRouter } from "next/navigation";
import OtpVerificationForm from "../templates/OtpVerificationForm";

interface IInterestModal {
  openModal: boolean;
  hideModal?: () => void;
  userData?: any;
  auctionDetail?: IAuction;
}

const InterestModal = (props: IInterestModal) => {
  const router = useRouter();
  const { openModal, hideModal = () => { }, userData, auctionDetail } = props;
  const [show, setShow] = useState({ login: false, signup: true });
  // const token = getCookie(COOKIES.TOKEN_KEY) ?? "";
  const [showOtpForm, setShowOtpForm] = useState(false);

  const [myToken, setMyToken] = useState(getCookie(COOKIES.TOKEN_KEY) ?? "");

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: showInterest,
    onSettled: async (data) => {
      console.log(data);
      const response = {
        data,
        success: () => {
          toast("Success", {
            theme: "success",
            position: "top-center",
          });
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

  const handleShowLogin = () => {
    setShow({ login: true, signup: false });
  };

  const handleShowRegister = () => {
    setShow({ login: false, signup: true });
    router.refresh();
  };
  const queryClient = useQueryClient();
  const [respError, setRespError] = useState<string>("");

  const handleLoginForm = () => {
    if (showOtpForm) {
      return (
        <OtpVerificationForm isAuthModal={true} loginApiCallback={hideModal} setShowOtpForm={() => setShowOtpForm(false)} />
      )
    }
    return (
      <LoginComp
        isAuthModal={true}
        handleLinkclick={handleShowRegister}
        closeModal={hideModal}
        setShowOtpForm={() => setShowOtpForm(true)}
      />
    );
  }
  const renderAuthComponent = () => {
    if (show?.login) {
      return (
        handleLoginForm()
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
  };

  const selectedHeading = () => {
    let heading = STRING_DATA.SHOW_INTEREST;
    if (show?.login && !myToken) {
      heading = STRING_DATA.LOGIN;
    }
    if (show?.signup && !myToken) {
      heading = STRING_DATA.REGISTER;
    }
    return heading;
  };

  const getIPAddress = async () => {
    try {
      // Get user's IP address using ipify
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ipAddress = data.ip;
      return ipAddress;
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  const handleInterestRequest = async () => {
    const ip = await getIPAddress();
    // console.log("handleInterestRequest", ip);
    const body = {
      ipAddress: ip,
      notice: auctionDetail?.id ?? "",
    };
    mutate(body);
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
            handleSubmit={handleInterestRequest}
            wantToUseFormikEvent={true}
            enableReinitialize={true}
          >
            {({ values, setFieldValue }: any) => (
              <Form>
                {/* {JSON.stringify(values)} */}
                <div className="flex flex-col gap-4 ">
                  <p className="text-sm text-gray-400">
                    Please review your contact details here. We will use these
                    to contact you on email and mobile
                  </p>
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
                    label="Phone number"
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
                        className={`flex justify-start items-center w-full cursor-pointer gap-2`}
                        htmlFor="check2"
                      >
                        <span className="text-sm text-gray-900">
                          I allow e-auctiondekho to send message on whatsapp{" "}
                        </span>
                        <span>
                          <WhatsappSvg />
                        </span>
                      </label>
                    </div>
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
                      disabled={!(values.check1 && values.check2)}
                    />
                  </div>
                </div>
              </Form>
            )}
          </CustomFormikForm>
        </>
      );
    } else {
      return renderAuthComponent();
    }
  };

  return (
    <>
      <CustomModal
        openModal={openModal}
        isCrossVisible={!myToken ? true : false}
        onClose={hideModal}
        modalHeading={selectedHeading()}
        customWidthClass="lg:w-[40%] md:w-4/5 sm:w-3/5 w-11/12"
      >
        <div className="w-full">{renderer()}</div>
      </CustomModal>
    </>
  );
};

export default InterestModal;
