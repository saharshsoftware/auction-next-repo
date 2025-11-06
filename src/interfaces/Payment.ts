/**
 * Payment and Membership related interfaces and types
 * Consolidated from multiple files for better code organization
 */

import { MembershipPlan } from "./MembershipPlan";

/**
 * Payment status types
 */
export type PaymentStatus = "Paid" | "Pending" | "Failed";

/**
 * Payment history entry
 */
export interface PaymentHistoryEntry {
  readonly referenceId: string;
  readonly date: string;
  readonly description: string;
  readonly amount: string;
  readonly status: PaymentStatus;
}

/**
 * Plan details for membership section
 */
export interface PlanDetails {
  readonly name: string;
  readonly status: string;
  readonly renewalDate: string;
  readonly planId: string;
  readonly benefits: readonly string[];
}

/**
 * Payment information
 */
export interface PaymentInfo {
  readonly method: string;
  readonly autoRenewal: boolean;
  readonly lastPaymentDate: string;
  readonly billingEmail: string;
  readonly gstNumber?: string;
}

/**
 * Props for PaymentHistoryTable component
 */
export interface PaymentHistoryTableProps {
  readonly entries: readonly PaymentHistoryEntry[];
}

/**
 * Props for ProfileMembershipSection component
 */
export interface ProfileMembershipSectionProps {
  readonly planDetails?: PlanDetails;
  readonly paymentInfo?: PaymentInfo;
  readonly paymentHistory?: readonly PaymentHistoryEntry[];
}

/**
 * Props for PlanDetailsCard component
 */
export interface PlanDetailsCardProps {
  readonly title: string;
  readonly statusLabel?: string;
  readonly children: React.ReactNode;
}

/**
 * Props for MembershipPlanCard component
 */
export interface MembershipPlanCardProps {
  readonly plan: MembershipPlan;
  readonly onSelectPlan: (plan: MembershipPlan) => void;
  readonly isCheckoutReady: boolean;
  readonly isProcessing?: boolean;
}

