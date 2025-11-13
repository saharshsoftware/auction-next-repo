"use client";
import React from "react";

interface SubscriptionPendingScreenProps {
  readonly pendingMessage?: string;
}

/**
 * Component to display a full-screen pending state when subscription is being processed
 */
export const SubscriptionPendingScreen: React.FC<SubscriptionPendingScreenProps> = ({
  pendingMessage,
}) => {
  return (
    <section className="px-4 lg:px-16 py-10  min-h-[80vh] flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col items-center gap-8 px-1 ">
        <div className="bg-white rounded-xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            ⏳Subscription Processing in progress
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 text-left">
            {pendingMessage || "Your subscription is being processed. Please wait while we activate your plan."}
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
            <p className="font-medium mb-1">⏳ Processing in progress</p>
            <p className="text-orange-700 ">
              This may take a few moments. You&apos;ll be notified once your subscription is active.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

