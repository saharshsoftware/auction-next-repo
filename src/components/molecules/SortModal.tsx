"use client";
import React, { useState } from "react";
import CustomModal from "../atoms/CustomModal";
import { SORT_OPTIONS } from "@/shared/Constants";
import { SortOption } from "@/types";

interface SortModalProps {
  onSortChange?: (sortOption: SortOption) => void;
  defaultSort?: SortOption;
  openModal: boolean;
  hideModal: () => void;
}

const SortModal: React.FC<SortModalProps> = ({
  onSortChange = () => { },
  defaultSort = SORT_OPTIONS[0],
  openModal = false,
  hideModal = () => { },
}) => {
  const [selectedSort, setSelectedSort] = useState<SortOption>(defaultSort);

  const handleSortChange = (sortOption: SortOption) => {
    setSelectedSort(sortOption);
    console.log("Sort changed to:", sortOption);
    onSortChange(sortOption);
    hideModal();
  };

  const renderSortModal = () => (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Sort By</h3>
      <div className="space-y-3">
        {SORT_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name="sort"
              value={option.value}
              checked={selectedSort?.value === option.value}
              onChange={() => handleSortChange(option)}
              className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-opacity-50"
              style={{
                accentColor: 'var(--brand-color)',
                '--tw-ring-color': 'var(--brand-color)'
              } as React.CSSProperties}
            />
            <span className="text-gray-700 flex-1">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <CustomModal
        openModal={openModal}
        customWidthClass="lg:w-1/3 md:w-1/2 sm:w-3/4 w-11/12"
        isCrossVisible={true}
        onClose={hideModal}
      >
        <div className="w-full">{renderSortModal()}</div>
      </CustomModal>
    </>
  );
};

export default SortModal;
