import React from "react";
import { CONFIG } from "@/config/routes";

interface DeepLinkModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Lightweight modal that nudges users towards the native app experience.
 */
const DeepLinkModal = ({ open, onClose }: DeepLinkModalProps) => {
  if (!open) {
    return null;
  }

  const storeLink = CONFIG.getStoreLink();

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl px-6 py-6 w-full max-w-sm text-center shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800">
          Get the eAuctionDekho App
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Enjoy faster browsing, personalized alerts and a better experience.
        </p>
        <div className="flex flex-col gap-3 mt-6">
          <a
            href={storeLink ?? "#"}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 active:scale-[0.97] transition"
          >
            Install App
          </a>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-300 active:scale-[0.97] transition"
          >
            Continue on Web
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeepLinkModal;

