"use client";
import React from "react";
import ReactPaginate from "react-paginate";
import "./style.css";

interface IReactPaginate {
  rowsPerPage?: number;
  activePage: number;
  totalCount?: number;
  totalPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const ReactPagination = (props: IReactPaginate) => {
  const {
    rowsPerPage,
    activePage=1,
    totalCount,
    totalPage,
    onPageChange = () => {},
  } = props;

  return (
    <div className="my-4 ">
      <ReactPaginate
        previousLabel="< previous"
        breakLabel="..."
        nextLabel="next >"
        pageCount={totalPage}
        onPageChange={onPageChange}
        // marginPagesDisplayed={1}
        // pageRangeDisplayed={3}
        forcePage={activePage - 1}
        className="flex justify-center pagination"
      />
    </div>
  );
};

export default ReactPagination;
