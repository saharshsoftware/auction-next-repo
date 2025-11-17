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
    <section className="px-4 lg:px-16 py-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center w-full border border-blue-100">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse" 
                style={{ background: 'linear-gradient(to bottom right, #5356FF, #3d40cc)' }}
              >
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Activating Your Subscription
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {pendingMessage || "Your subscription is being processed. This may take a few moments."}
          </p>
          {/* Status Box */}
          <div 
            className="rounded-xl p-6 text-white" 
            style={{ background: 'linear-gradient(to right, #5356FF, #3d40cc)' }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-lg">Processing...</p>
            </div>
            <p className="text-blue-100 text-sm">
              Please wait while we activate your account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};