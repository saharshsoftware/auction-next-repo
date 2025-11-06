"use client";
import React from "react";
import { STRING_DATA } from "@/shared/Constants";
import PlanDetailsCard from "@/components/ui/PlanDetailsCard";
import PaymentHistoryTable from "@/components/ui/PaymentHistoryTable";
import {
  PlanDetails,
  PaymentInfo,
  ProfileMembershipSectionProps,
  PaymentHistoryEntry,
} from "@/interfaces/Payment";

const DEFAULT_PLAN_DETAILS: PlanDetails = {
  name: "Broker Plus",
  status: "Active",
  renewalDate: "06 Nov 2025",
  planId: "BROKER-PLUS-2025",
  benefits: [
    "10 saved collections",
    "5 active alerts",
    "Unlimited saved searches",
    "WhatsApp and email notifications",
  ],
};

const DEFAULT_PAYMENT_INFO: PaymentInfo = {
  method: "Visa ending •••• 4242",
  autoRenewal: true,
  lastPaymentDate: "06 Oct 2025",
  billingEmail: "billing@example.com",
  gstNumber: "29ABCDE1234F2Z5",
};

const DEFAULT_PAYMENT_HISTORY: readonly PaymentHistoryEntry[] = [
  {
    referenceId: "INV-1024",
    date: "06 Oct 2025",
    description: "Broker Plus monthly renewal",
    amount: "₹1,999",
    status: "Paid",
  },
  {
    referenceId: "INV-0987",
    date: "06 Sep 2025",
    description: "Broker Plus monthly renewal",
    amount: "₹1,999",
    status: "Paid",
  },
  {
    referenceId: "INV-0943",
    date: "06 Aug 2025",
    description: "Broker Plus monthly renewal",
    amount: "₹1,999",
    status: "Paid",
  },
];

/**
 * Displays the membership plan details, payment info, and payment history for the profile page.
 */
const ProfileMembershipSection: React.FC<ProfileMembershipSectionProps> = (props) => {
  const { planDetails = DEFAULT_PLAN_DETAILS, paymentInfo = DEFAULT_PAYMENT_INFO, paymentHistory = DEFAULT_PAYMENT_HISTORY } = props;
  return (
    <div className="flex flex-col gap-6">
      <PlanDetailsCard title={STRING_DATA.MEMBERSHIP_PLAN_DETAILS} statusLabel={planDetails.status}>
        <p className="text-sm text-gray-500">{planDetails.planId}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">{planDetails.name}</p>
            <p className="text-sm text-gray-500">
              {STRING_DATA.MEMBERSHIP_PLAN_RENEWAL}: {planDetails.renewalDate}
            </p>
          </div>
          <ul className="grid gap-2 text-sm text-gray-600">
            {planDetails.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-color"></span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </PlanDetailsCard>
      <PlanDetailsCard title={STRING_DATA.MEMBERSHIP_PAYMENT_INFO}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">{STRING_DATA.MEMBERSHIP_PAYMENT_METHOD}</p>
            <p className="text-sm text-gray-800">{paymentInfo.method}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">{STRING_DATA.MEMBERSHIP_PAYMENT_AUTORENEW}</p>
            <p className="text-sm text-gray-800">{paymentInfo.autoRenewal ? STRING_DATA.YES : STRING_DATA.NO}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">{STRING_DATA.MEMBERSHIP_PAYMENT_LAST}</p>
            <p className="text-sm text-gray-800">{paymentInfo.lastPaymentDate}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">{STRING_DATA.MEMBERSHIP_PAYMENT_BILLING_EMAIL}</p>
            <p className="text-sm text-gray-800">{paymentInfo.billingEmail}</p>
          </div>
          {paymentInfo.gstNumber ? (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">{STRING_DATA.MEMBERSHIP_PAYMENT_GST}</p>
              <p className="text-sm text-gray-800">{paymentInfo.gstNumber}</p>
            </div>
          ) : null}
        </div>
      </PlanDetailsCard>
      <PaymentHistoryTable entries={paymentHistory} />
    </div>
  );
};

export default ProfileMembershipSection;

