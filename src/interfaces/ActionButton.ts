export interface IActionButton {
  text: string | JSX.Element;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  customClass?: string;
  isSubmit?: boolean;
  icon?: any;
  isSidebar?: boolean;
}
