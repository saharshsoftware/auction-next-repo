import React from 'react';
import { STRING_DATA } from '@/shared/Constants';
import { userTypeOptions } from '@/shared/Utilies';

interface UserTypeRadioProps {
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  className?: string;
}

const UserTypeRadio: React.FC<UserTypeRadioProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {userTypeOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="userType"
            value={option.value}
            checked={value?.value === option.value}
            onChange={() => !disabled && onChange(option)}
            disabled={disabled}
            className="radio radio-sm"
          />
          <span className="text-sm font-medium text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

// Original implementation (commented out)
/*
const UserTypeRadio: React.FC<UserTypeRadioProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {userTypeOptions.map((option) => (
        <label
          key={option.value}
          className={`flex justify-center items-center border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded-lg cursor-pointer transition-all md:hover:bg-blue-100 peer-checked:bg-blue-500 peer-checked:text-white ${value?.value === option.value ? "bg-blue-400 text-white" : ""
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name="userType"
            value={option.value}
            checked={value?.value === option.value}
            onChange={() => !disabled && onChange(option)}
            className="peer hidden"
            disabled={disabled}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
*/

export default UserTypeRadio; 