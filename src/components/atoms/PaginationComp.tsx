"use client"
import React from 'react'
import {
  Pagination,
  PaginationItem,
  PaginationCursor,
} from "@nextui-org/pagination";

interface IPaginationComp {
  onChangePage?: (page: number) => void;
  totalPage: number
}

const PaginationComp = (props: IPaginationComp) => {
  const { onChangePage, totalPage } = props;
  return (
    <>
      <Pagination
        className="overflow-auto"
        classNames={{
          wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
          item: "w-8 h-8 text-small rounded-none bg-transparent",
          cursor:
            "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
        }}
        total={totalPage}
        initialPage={1}
        onChange={onChangePage}
      />
    </>
  );
}

export default PaginationComp