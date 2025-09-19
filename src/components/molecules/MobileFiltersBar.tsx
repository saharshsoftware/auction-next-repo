"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort, faTimes } from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "@/shared/Utilies";
import { STRING_DATA, RANGE_PRICE } from "@/shared/Constants";

interface FilterData {
  category?: { name?: string | null; label?: string };
  location?: { name?: string | null; label?: string };
  bank?: { name?: string | null; label?: string };
  propertyType?: { name?: string | null; label?: string };
  price?: number[] | string[];
}

interface MobileFiltersBarProps {
  filterData: FilterData;
  onShowModal: () => void;
  onRemoveFilter: (filterType: string) => void;
  onShowSortModal: () => void;
  onSortChange: (sortOption: any) => void;
}

const MobileFiltersBar: React.FC<MobileFiltersBarProps> = ({
  filterData,
  onShowModal,
  onRemoveFilter,
  onShowSortModal,
  onSortChange,
}) => {
  const mobileViewFilterClass = () =>
    "border bg-white text-sm text-gray-800 shadow px-2 py-1 min-w-fit rounded-lg border-brand-color text-center line-clamp-1";

  const renderFilterTabs = (value: string, onRemove?: () => void) => {
    return value ? (
      <div className={`${mobileViewFilterClass()} flex items-center gap-2 justify-between flex-shrink-0 whitespace-nowrap`}>
        <span className="truncate">{value}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-brand-color hover:text-brand-color/80 text-xs font-bold flex-shrink-0"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    ) : null;
  };

  // Count active filters
  let activeFiltersCount = 0;
  const hasCategory = filterData?.category?.name && filterData?.category?.label !== STRING_DATA.ALL;
  const hasLocation = filterData?.location?.name && filterData?.location?.label !== STRING_DATA.ALL;
  const hasBank = filterData?.bank?.name && filterData?.bank?.label !== STRING_DATA.ALL;
  const hasPropertyType = filterData?.propertyType?.name && filterData?.propertyType?.label !== STRING_DATA.ALL;
  const hasPrice = filterData?.price?.length && (Number(filterData?.price?.[0]) !== Number(RANGE_PRICE.MIN) || Number(filterData?.price?.[1]) !== Number(RANGE_PRICE.MAX));

  if (hasCategory) activeFiltersCount++;
  if (hasLocation) activeFiltersCount++;
  if (hasBank) activeFiltersCount++;
  if (hasPropertyType) activeFiltersCount++;
  if (hasPrice) activeFiltersCount++;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        {/* Scrollable filters container */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pr-2" style={{ marginRight: '2px' }}>
            <div className={`${mobileViewFilterClass()} cursor-pointer flex-shrink-0`} onClick={onShowModal}>
              <div className="flex items-center gap-2 font-semibold">
                Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : (
                  <FontAwesomeIcon icon={faFilter} className="text-brand-color" />
                )}
              </div>
            </div>
            {hasCategory && renderFilterTabs(
              filterData?.category?.name || '',
              () => onRemoveFilter('category')
            )}
            {hasLocation && renderFilterTabs(
              filterData?.location?.name || '',
              () => onRemoveFilter('location')
            )}
            {hasBank && renderFilterTabs(
              filterData?.bank?.name || '',
              () => onRemoveFilter('bank')
            )}
            {hasPropertyType && renderFilterTabs(
              filterData?.propertyType?.name || '',
              () => onRemoveFilter('propertyType')
            )}
            {hasPrice && renderFilterTabs(
              `${formatPrice(filterData?.price?.[0] || 0)} - ${formatPrice(filterData?.price?.[1] || 0)}`,
              () => onRemoveFilter('price')
            )}
          </div>
        </div>        
      </div>
    </div>
  );
};

export default MobileFiltersBar;
