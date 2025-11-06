"use client";
import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import { PaymentStatus, PaymentHistoryTableProps } from "@/interfaces/Payment";

export type { PaymentStatus, PaymentHistoryEntry } from "@/interfaces/Payment";

const getStatusBadgeClass = (status: PaymentStatus): string => {
  if (status === "Paid") {
    return "bg-green-100 text-green-700";
  }
  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }
  return "bg-red-100 text-red-700";
};

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = (props) => {
  const { entries } = props;
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{STRING_DATA.MEMBERSHIP_PAYMENT_HISTORY}</h3>
      <div className="flex flex-col gap-4 md:hidden">
        {entries.map((entry) => (
          <article
            key={entry.referenceId}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-gray-900">{entry.amount}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(entry.status)}`}>
                {entry.status}
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
              <span>{entry.description}</span>
              <span className="text-xs uppercase tracking-wide text-gray-500">{entry.date}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">{STRING_DATA.MEMBERSHIP_HISTORY_DATE}</th>
              <th className="px-4 py-3">{STRING_DATA.MEMBERSHIP_HISTORY_DESCRIPTION}</th>
              <th className="px-4 py-3">{STRING_DATA.MEMBERSHIP_HISTORY_AMOUNT}</th>
              <th className="px-4 py-3">{STRING_DATA.MEMBERSHIP_HISTORY_STATUS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr key={entry.referenceId}>
                <td className="px-4 py-3 text-sm text-gray-600">{entry.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{entry.description}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{entry.amount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(entry.status)}`}>
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PaymentHistoryTable;

