import { MembershipPlan } from "@/interfaces/MembershipPlan";

/**
 * Gets button text based on plan state and authentication status
 */
export const getButtonText = (
  plan: MembershipPlan,
  isBrokerPlus: boolean,
  isCurrentPlan: boolean,
  isThisPlanProcessing: boolean,
  isMounted: boolean,
  isAuthenticated: boolean
): string => {
  if (isBrokerPlus) return "Contact Sales";
  if (isCurrentPlan) return "Your Current Plan";
  if (isThisPlanProcessing) return "Processing...";
  if (!isMounted) return plan.ctaLabel;
  if (!isAuthenticated) return "Signup to Subscribe";
  return plan.ctaLabel;
};

/**
 * Gets CSS classes for plan card container
 */
export const getPlanCardClasses = (plan: MembershipPlan, isCurrentPlan: boolean): string => {
  const baseClasses = "relative flex flex-col h-full rounded-xl border p-6 shadow-md transition-all duration-300";
  if (plan.isPopular && isCurrentPlan) {
    return `${baseClasses} scale-105 bg-green-50 border-green-400`;
  }
  if (plan.isPopular) {
    return `${baseClasses} border-2 border-blue-500 scale-105`;
  }
  if (isCurrentPlan) {
    return `${baseClasses} border-gray-200 bg-green-50 border-green-400`;
  }
  return `${baseClasses} border-gray-200 bg-white`;
};

/**
 * Gets CSS classes for action button
 */
export const getActionButtonClasses = (
  isCurrentPlan: boolean,
  isBrokerPlus: boolean,
  isButtonDisabled: boolean
): string => {
  const baseClasses = "mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200";
  
  if (isCurrentPlan) {
    return `${baseClasses} bg-gray-400 cursor-not-allowed`;
  }
  
  if (isBrokerPlus) {
    return `${baseClasses} bg-purple-600 hover:bg-purple-700 active:bg-purple-800 cursor-pointer`;
  }
  
  const stateClasses = isButtonDisabled
    ? "opacity-60 cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800";
  
  return `${baseClasses} ${stateClasses}`;
};

