'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import SortModal from '../molecules/SortModal'
import useModal from '@/hooks/useModal'
import { setCookie } from 'cookies-next'
import { COOKIES } from '@/shared/Constants'
import { useRouter } from 'next/navigation'

const MobileSortContainer = () => {
  const { showModal: showSortModal, openModal: openSortModal, hideModal: hideSortModal } = useModal();
  const router = useRouter();
  
  const handleSortChange = (sortOption: any) => {
    setCookie(COOKIES.SORT_KEY, sortOption.value);
    router.refresh();
  };
  
  const mobileViewFilterClass = () =>
    "border bg-white text-sm text-gray-800 shadow px-2 py-1 min-w-fit rounded-lg border-brand-color text-center line-clamp-1 h-8";
  return (
    
    <>
    <div className="flex-shrink-0 lg:hidden">
      <div className={`${mobileViewFilterClass()} cursor-pointer`} onClick={showSortModal}>
        <div className="flex items-center gap-2 font-semibold h-full">
          {/* Sort By */}
          <FontAwesomeIcon icon={faSort} className="text-brand-color" />
        </div>
      </div>
    </div>
    <SortModal onSortChange={handleSortChange} openModal={openSortModal} hideModal={hideSortModal} />
    </>
  )
}

export default MobileSortContainer