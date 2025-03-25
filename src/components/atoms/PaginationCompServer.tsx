"use client";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { setDataInQueryParams } from "@/shared/Utilies";
import { useRouter } from "next/navigation";
import React from "react";
import ReactPaginate from "react-paginate";

const PaginationCompServer = (props: {
  totalPage: number;
  activePage?: number;
}) => {
  const { activePage = 1, totalPage } = props;
  const router = useRouter();
  const handlePageChange = async (event: { selected: number }) => {
    const { selected: page } = event;
    const pageValue = page + 1;
    const newParams = { page: pageValue };
    const encodedQuery = setDataInQueryParams(newParams);
    router.push(ROUTE_CONSTANTS.AUCTION + "?q=" + encodedQuery);
  };

  return (
    <div className="my-4 ">
      <ReactPaginate
        previousLabel="< previous"
        breakLabel="..."
        nextLabel="next >"
        pageCount={totalPage}
        onPageChange={handlePageChange}
        marginPagesDisplayed={1}
        pageRangeDisplayed={1}
        forcePage={activePage - 1}
        className="flex justify-center pagination"
      />
    </div>
  );
};

export default PaginationCompServer;
