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
    <div className="flex flex-col gap-2 w-full items-start">
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
