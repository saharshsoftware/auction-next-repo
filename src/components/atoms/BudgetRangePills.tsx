"use client";
import React from "react";
import { normalizeBudgetRanges, formatPriceCompact } from "@/shared/Utilies";
import { BudgetRangeObject } from "@/types";

interface BudgetRangePillsProps {
  budgetRanges: BudgetRangeObject[] | undefined;
  emptyText?: string;
  pillClassName?: string;
  containerClassName?: string;
}

/**
 * BudgetRangePills component displays budget ranges as styled pills/chips
 * @param budgetRanges - Array of budget range objects with min and max values
 * @param emptyText - Text to display when no budget ranges are provided (default: "-")
 * @param pillClassName - Custom CSS classes for individual pills
 * @param containerClassName - Custom CSS classes for the container
 */
const BudgetRangePills: React.FC<BudgetRangePillsProps> = ({
  budgetRanges,
  emptyText = "-",
  pillClassName = "px-2 py-0.5 rounded-full border border-primary text-primary text-sm",
  containerClassName = "flex flex-wrap gap-2",
}) => {
  const normalized = normalizeBudgetRanges(budgetRanges);

  if (!normalized || normalized.length === 0) {
    return <div className="text-gray-600">{emptyText}</div>;
  }

  return (
    <div className={containerClassName}>
      {normalized.map((r, idx) => {
        const isInfinity = r.max.toLowerCase() === "infinity";
        const formattedMin = formatPriceCompact(r.min);
        const formattedMax = formatPriceCompact(r.max);
        const displayText = isInfinity ? `₹${formattedMin}+` : `₹${formattedMin} - ₹${formattedMax}`;
        
        return (
          <span key={`budget-chip-${idx}`} className={pillClassName}>
            {displayText}
          </span>
        );
      })}
    </div>
  );
};

export default BudgetRangePills;

