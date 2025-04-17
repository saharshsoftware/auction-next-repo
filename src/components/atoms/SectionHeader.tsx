import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  highlightedText: string;
  description: string;
}

export function SectionHeader({
  title,
  highlightedText,
  description,
}: SectionHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-semibold my-2">
        {title} <span className="text-blue-600">{highlightedText}</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
    </div>
  );
}
