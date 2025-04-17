import { ReactNode } from "react";

interface CustomCardProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
}

export function CustomCard({
  children,
  className = "",
  onClick,
  header,
  footer,
  hoverable = true,
}: CustomCardProps) {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer
          ${
            hoverable ? "hover:md:shadow-lg transition-shadow" : ""
          } ${className}`}
      onClick={onClick}
    >
      {header && (
        <div className="flex flex-row items-center justify-between p-6 pb-2">
          {header}
        </div>
      )}
      <div className="p-6 pt-0">{children}</div>
      {footer && <div className="flex items-center p-6 pt-0">{footer}</div>}
    </div>
  );
}
