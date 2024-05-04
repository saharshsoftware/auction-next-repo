export interface IReactPaginate {
  rowsPerPage?: number;
  activePage: number;
  totalCount?: number;
  totalPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}