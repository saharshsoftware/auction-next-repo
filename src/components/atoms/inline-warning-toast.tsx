import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface InlineWarningToastProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

type ActionButtonProps = {
  actionLabel?: string;
  onAction?: () => void;
  onClick: () => void;
};

type CloseButtonProps = {
  onClose?: () => void;
  onClick: () => void;
};

const renderActionButton = (props: ActionButtonProps): React.ReactNode => {
  const { actionLabel, onAction, onClick } = props;
  if (!actionLabel || !onAction) {
    return null;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 w-fit text-sm font-semibold text-blue-600 hover:underline"
    >
      {actionLabel}
    </button>
  );
};

const renderCloseButton = (props: CloseButtonProps): React.ReactNode => {
  const { onClose, onClick } = props;
  if (!onClose) {
    return null;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-2 text-yellow-700 transition hover:text-yellow-900"
      aria-label="Dismiss notification"
    >
      <X aria-hidden="true" className="h-4 w-4" />
    </button>
  );
};

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
  const actionContent = renderActionButton({ actionLabel, onAction, onClick: handleAction });
  const closeContent = renderCloseButton({ onClose, onClick: handleClose });
  return (
    <div className="flex w-full items-start gap-3 rounded-md border border-yellow-200 border-l-4 border-l-yellow-500 bg-yellow-50 px-4 py-3 shadow-sm">
      <AlertTriangle aria-hidden="true" className="h-5 w-5 text-yellow-600" />
      <div className="flex flex-1 flex-col text-left text-sm text-yellow-900">
        <span className="font-semibold">{title}</span>
        {description ? <span className="mt-1 text-yellow-800">{description}</span> : null}
        {actionContent ? actionContent : null}
      </div>
      {closeContent ? closeContent : null}
    </div>
  );
};

export default InlineWarningToast;
