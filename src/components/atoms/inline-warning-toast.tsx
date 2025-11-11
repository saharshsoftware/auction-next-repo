import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface InlineWarningToastProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

/**
 * Renders an inline warning notification banner with optional action and dismiss controls.
 */
const InlineWarningToast: React.FC<InlineWarningToastProps> = (props) => {
  const { title, description, actionLabel, onAction, onClose } = props;
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  return (
    <div className="flex w-full  items-start gap-3 rounded-md border border-yellow-200 border-l-4 border-l-yellow-500 bg-yellow-50 px-4 py-3 shadow-sm">
      <AlertTriangle aria-hidden="true" className="h-5 w-5 text-yellow-600" />
      <div className="flex flex-1 flex-col text-sm text-left text-yellow-900">
        <span className="font-semibold">{title}</span>
        {description ? <span className="mt-1 text-yellow-800">{description}</span> : null}
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={handleAction}
            className="mt-2 w-fit text-sm font-semibold text-blue-600 hover:underline"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 text-yellow-700 transition hover:text-yellow-900"
          aria-label="Dismiss notification"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
};

export default InlineWarningToast;

