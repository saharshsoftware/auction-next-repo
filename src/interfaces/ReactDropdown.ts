export interface IReactSelectDropdown {
  options?: any;
  loading?: boolean;
  noDataRenderer?: any;
  itemRenderer?: any;
  customClass?: string;
  onChange?: (event: any) => void;
  name?: string;
  placeholder?: string;
  defaultValue?: any;
  resetKey?: boolean;
  clearRenderer?: any;
  clearable?: boolean;
  menuIsOpen?: boolean;
  isMulti?: boolean;
  maxMultiSelectOptions?: number;
  hidePlaceholder?: boolean;
}
