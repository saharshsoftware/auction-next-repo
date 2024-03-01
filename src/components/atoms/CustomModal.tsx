import React from "react";

interface props {
  children: React.ReactElement;
  openModal: boolean;
}

const CustomModal = (props: props) => {
  const { children, openModal = false } = props;

  const renderer = () => {
    if (openModal) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-6 md:w-1/2 sm:w-4/5 w-11/12">
            {children}
          </div>
        </div>
      );
    }
  };
  return <>{renderer()}</>;
};

export default CustomModal;
