"use client";
import React from "react";
import { PlanDetailsCardProps } from "@/interfaces/Payment";

const PlanDetailsCard: React.FC<PlanDetailsCardProps> = (props) => {
  const { title, statusLabel, children } = props;
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {statusLabel ? (
          <span className="rounded-full bg-brand-color/10 px-4 py-1 text-xs font-semibold text-brand-color">
            {statusLabel === 'Pending_cancellation' ? 'Active' : statusLabel}
          </span>
        ) : null}
      </header>
      <div className="flex flex-col gap-3 text-sm text-gray-700">{children}</div>
    </section>
  );
};

export default PlanDetailsCard;

