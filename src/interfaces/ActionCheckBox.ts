export interface IActionCheckBox {
  checkboxLabel: string;
  id?: string;
  checked?: boolean;
  onChange?: React.FormEventHandler<HTMLInputElement>;
  disabled?: boolean;
  customClass?: string;
}