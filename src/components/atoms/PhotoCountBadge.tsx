import React from "react";
import { Camera } from "lucide-react";

interface PhotoCountBadgeProps {
  count: number;
  className?: string;
}

export const PhotoCountBadge: React.FC<PhotoCountBadgeProps> = ({ count, className = "" }) => {
  if (count <= 0) return null;

  return (
    <div className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
      <Camera className="h-3 w-3" />
      <span>{count} photo{count > 1 ? "s" : ""} 2qweqw</span>
    </div>
  );
};

