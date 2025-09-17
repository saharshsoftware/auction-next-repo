"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ReactSelectDropdown from './ReactSelectDropdown';
import { COOKIES, SORT_OPTIONS } from '@/shared/Constants';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { SortOption } from '@/types';

const SortByDropdown: React.FC = () => {  
  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);

  // Initialize selected sort from cookie
  useEffect(() => {
    const sortKey = getCookie(COOKIES.SORT_KEY) as string;
    const currentSortValue = sortKey || 'effectiveAuctionStartTime:desc';
    const currentSort = SORT_OPTIONS.find(option => option.value === currentSortValue) || SORT_OPTIONS[0];
    setSelectedSort(currentSort);
  }, []);

  const handleSortChange = useCallback((selectedOption: SortOption) => {
    // Optimistic update - immediately reflect the change in UI
    setSelectedSort(selectedOption);
    
    // Update cookie
    setCookie(COOKIES.SORT_KEY, selectedOption.value);
    
    router.refresh();
  }, [router]);

  // Don't render until we have the selected sort to avoid flashing
  if (!selectedSort) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center justify-between gap-2 w-96">
      <span className="text-sm text-gray-900 w-16">Sort By</span>
      <ReactSelectDropdown
        name="sort"
        options={SORT_OPTIONS}
        placeholder="Sort By"
        value={selectedSort}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default SortByDropdown;
