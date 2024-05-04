import { IActionCheckBox } from '@/interfaces/ActionCheckBox';
import React from 'react'

const ActionCheckbox = (props: IActionCheckBox) => {
  const { checkboxLabel, checked = false, onChange, disabled, id, name } = props;
  return (
    <>
      <label className="cursor-pointer flex items-center justify-end gap-4" htmlFor={name}>
        <span className="label-text text-sm" id={id}>
          {checkboxLabel}
        </span>
        <input
          type="checkbox"
          className="toggle toggle-sucess toggle-sm"
          checked={checked}
          name={name}
          disabled={disabled}
          onChange={onChange}
        />
      </label>
    </>
  );
};

export default ActionCheckbox