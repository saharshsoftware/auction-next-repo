"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactSelectDropdown from './ReactSelectDropdown';

export interface SortOption {
  label: string;
  value: string;
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Auction Date (Desc)', value: 'effectiveAuctionStartTime:desc' },
  { label: 'Auction Date (Asc)', value: 'effectiveAuctionStartTime:asc' },
  { label: 'Price: Low - High', value: 'reservePrice:asc' },
  { label: 'Price: High - Low', value: 'reservePrice:desc' },
];

const SortByDropdown: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'effectiveAuctionStartTime:desc';

  const handleSortChange = (selectedOption: any) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('sort', selectedOption.value);
    
    // Update URL with new sort parameter
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
    router.push(newUrl);
  };

  const defaultValue = SORT_OPTIONS.find(option => option.value === currentSort);

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <ReactSelectDropdown
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
