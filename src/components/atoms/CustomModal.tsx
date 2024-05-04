import React from "react";

interface props {
  children: React.ReactElement;
  openModal: boolean;
  customWidthClass?: string;
  modalHeading?: string;
}

const CustomModal = (props: props) => {
  const {
    modalHeading, children,
    openModal = false,
    customWidthClass = "",
  } = props;

  const getRequiredWidth = () => {
    if (customWidthClass) {
      return customWidthClass;
    }
    return "lg:w-1/2 md:w-3/5 sm:w-4/5 w-11/12";
  }

  const renderer = () => {
    if (openModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-lg flex flex-col gap-4 p-6 ${getRequiredWidth()}`}
          >
            {modalHeading ? (
              <h2 className="custom-h2-class text-left text-3xl">
                {modalHeading}
              </h2>
            ) : null}
            {children}
          </div>
        </div>
      );
    }
  };
  return <>{renderer()}</>;
};

export default CustomModal;
