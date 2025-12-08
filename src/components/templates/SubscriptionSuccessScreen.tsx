"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isInMobileApp, sendToApp } from "@/helpers/NativeHelper";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useConfettiStore } from "@/zustandStore/confettiStore";
import { NATIVE_APP_MESSAGE_TYPES, URL_PARAMS } from "@/shared/Constants";

interface SubscriptionSuccessScreenProps {
  readonly planName?: string;
}

/**
 * Component to display a success screen after subscription is activated
 * Shows action buttons and a special message for mobile app users
 */
export const SubscriptionSuccessScreen: React.FC<SubscriptionSuccessScreenProps> = ({
  planName,
}) => {
  const [isMobileApp, setIsMobileApp] = useState(false);
  const searchParams = useSearchParams();
  const isFromMobileApp = searchParams.get(URL_PARAMS.SOURCE) === URL_PARAMS.MOBILE_APP;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Trigger confetti celebration
    useConfettiStore.getState().showConfetti();
    
    // Check if in mobile app and send native event
    const inMobileApp = isInMobileApp();
    setIsMobileApp(inMobileApp);
    
    if (inMobileApp) {
      sendToApp(NATIVE_APP_MESSAGE_TYPES.SUBSCRIPTION_ACTIVATED, {
        message: "Subscription activated successfully",
        timestamp: Date.now(),
      });
    }
  }, []);

  return (
    <section className="px-4 lg:px-16 py-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center w-full border border-emerald-100">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center animate-bounce-once"
                style={{ background: 'linear-gradient(to bottom right, #10B981, #059669)' }}
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
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Subscription Activated!
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Congratulations! Your{planName ? ` ${planName}` : ''} subscription is now active.
          </p>
          <p className="text-gray-500 mb-8">
            You now have access to all premium features.
          </p>

          {/* Mobile App Update Message - shown when inside mobile app webview */}
          {isMobileApp && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-amber-700 mb-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold">Update Required</span>
              </div>
              <p className="text-amber-600 text-sm">
                Please update your app to see your new subscription benefits.
              </p>
            </div>
          )}

          {/* Mobile App Source Message - shown when user came from mobile app (e.g., opened in external browser) */}
          {isFromMobileApp && !isMobileApp && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-semibold">Get the Best Experience</span>
              </div>
              <p className="text-blue-600 text-sm">
                Update or install the Auction app from your app store to enjoy all your subscription benefits.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              href={ROUTE_CONSTANTS.AUCTION}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl border-2 border-emerald-500 hover:bg-emerald-50 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Explore Auctions
            </Link>
          </div>
        </div>
      </div>

      {/* Custom animation keyframe */}
      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
      `}</style>
    </section>
  );
};

