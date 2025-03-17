import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import Image from "next/image";
import ActionButton from "../atoms/ActionButton";
import CustomLoading from "../atoms/Loading";
import logo from "@/assets/images/no-data.jpg";

interface IFullScreenImageModal {
  openModal: boolean;
  hideModal?: () => void;
  imageUrl?: string;
}

const FullScreenImageModal: React.FC<IFullScreenImageModal> = ({
  openModal,
  hideModal = () => {},
  imageUrl,
}) => {
  const placeholderImage = logo.src;
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log("imageUrl", { imageUrl });

  return (
    <CustomModal
      openModal={openModal}
      customWidthClass="w-full h-full flex items-center justify-center rounded-none"
    >
      <div className="relative w-full h-full flex flex-col items-center bg-white bg-opacity-90 p-4">
        <div className="absolute -top-4 -right-4 ">
          <ActionButton
            text="Close"
            onclick={hideModal}
            customClass="bg-red-500 text-white p-2 min-h-[2rem] h-[2rem] rounded-lg hover:bg-red-600"
          />
        </div>
        <div className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center">
          {isLoading && !hasError && <CustomLoading />}
          {hasError && <p className="text-red-500">Failed to load image</p>}
          {/* <Image
            src={hasError ? placeholderImage : imageUrl || placeholderImage}
            alt="Displayed Image"
            layout="intrinsic"
            width={800}
            height={600}
            className="max-w-full max-h-[90vh] object-contain shadow-lg rounded-lg"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          /> */}

          <img
            src={hasError ? placeholderImage : imageUrl || placeholderImage}
            alt="Displayed Image"
            className="max-w-full max-h-[90vh] object-contain shadow-lg rounded-lg"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default FullScreenImageModal;
