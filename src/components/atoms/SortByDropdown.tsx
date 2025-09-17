"use client";
import React from 'react';
import ReactSelectDropdown from './ReactSelectDropdown';
import { COOKIES, SORT_OPTIONS } from '@/shared/Constants';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const SortByDropdown: React.FC = () => {  
  const router = useRouter();
  const sortKey = getCookie(COOKIES.SORT_KEY);
  const currentSort = sortKey || 'effectiveAuctionStartTime:desc';

  const handleSortChange = (selectedOption: any) => {
    setCookie(COOKIES.SORT_KEY, selectedOption.value);
    router.refresh();
  };

  const defaultValue = SORT_OPTIONS.find(option => option.value === currentSort);

  return (
    <div className="hidden lg:flex items-center justify-between gap-2 ">
      <span className="text-sm text-gray-900 w-16">Sort By</span>
      <ReactSelectDropdown
        key={currentSort} // Force re-render when sort changes
        name="sort"
        options={SORT_OPTIONS}
        placeholder="Sort By"
        defaultValue={defaultValue}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default SortByDropdown;
