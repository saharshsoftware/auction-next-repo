import { ErrorMessage, FieldHookConfig, useField } from "formik";
import { INPUT_TYPE } from "../../shared/Constants";
import { formatPrice } from "../../shared/Utilies";

interface ICustomInput {
  type?: "text" | "password" | "number" | "textarea" | "range";
  placeholder?: string;
  name?: string;
  id?: string;
  customClass?: string;
  disabled?: boolean;
  label?: string;
  autoComplete?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  rows?: number;
  children?: React.ReactNode;
  hasChildren?: boolean;
  value?: string;
  min?: string;
  max?: string;
  isSearch?: boolean;
  showNumber91?: boolean;
}

const TextField: React.FC<FieldHookConfig<string> & ICustomInput> = (props) => {
  const {
    type,
    name,
    id,
    onChange,
    onBlur,
    disabled,
    customClass,
    placeholder,
    label,
    autoComplete = "off",
    rows,
    children,
    hasChildren,
    value,
    min,
    max,
    showNumber91=false,
    isSearch = false,
  } = props;
  const [field] = useField(props);

  const renderInput = () => (
    <input
      className={`${customClass || "form-controls"} `}
      type={type}
      id={id ?? name}
      name={name || field.name}
      onChange={
        (onChange as React.ChangeEventHandler<HTMLInputElement>) ||
        field.onChange
      }
      disabled={disabled}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onBlur={
        (onBlur as React.FocusEventHandler<HTMLInputElement>) || field.onBlur
      }
      min={min}
      max={max}
    />
  );

  const renderTextarea = () => (
    <textarea
      className={`${customClass || "form-controls"} `}
      id={id ?? name}
      name={name || field.name}
      onChange={
        (onChange as React.ChangeEventHandler<HTMLTextAreaElement>) ||
        field.onChange
      }
      rows={rows ?? 3}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onBlur={
        (onBlur as React.FocusEventHandler<HTMLTextAreaElement>) || field.onBlur
      }
    />
  );

  const renderInputField = () => {
    if (type === "textarea") {
      return renderTextarea();
    }
    return renderInput();
  };

  const renderData = () => {
    if (hasChildren) {
      return children;
    }
    return renderInputField();
  };

  const showPriceValue = () =>
    name === "price" && type === INPUT_TYPE.RANGE && field.value;

  return (
    <div className="flex flex-col gap-2 w-full items-start relative">
      {label ? (
        <label
          htmlFor={name}
          className={`flex justify-between items-center w-full `}
        >
          <span className="text-sm text-gray-900">{label} </span>
          {showPriceValue() ? (
            <span className="font-bold text-lg custom-prize-color">
              {formatPrice(field.value)}
            </span>
          ) : null}
        </label>
      ) : null}
      {isSearch ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-1 bottom-2 h-6 w-6 mr-2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ) : null}
      {/* {showNumber91 ? (
        <span className="absolute left-1 top-9 h-6 w-6 mr-2"> +91</span>
      ) : null} */}
      {renderData()}

      <ErrorMessage
        name={field.name}
        component={"div"}
        className="text-sm text-error"
      />
    </div>
  );
};

export default TextField;
