"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";
import { COOKIES, FEATURE_FLAGS, STRING_DATA } from "@/shared/Constants";
import { LeadNoticeRecommendation } from "@/types";
import ReactPagination from "@/components/atoms/PaginationComp";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import { fetchUserLeadRecommendations } from "@/services/auction";
import { getStaticRecommendationsByPage } from "@/data/user-recommendations";
import SkeltonAuctionCard from "@/components/skeltons/SkeltonAuctionCard";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";

const PAGE_SIZE = 10;

export default function UserRecommendationsPage() {
  const [items, setItems] = useState<LeadNoticeRecommendation[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isAuthenticated = Boolean(getCookie(COOKIES.TOKEN_KEY));

  const fetchLeadRecommendations = async (page: number) => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = FEATURE_FLAGS.USE_STATIC_RECOMMENDATIONS
        ? getStaticRecommendationsByPage(page, PAGE_SIZE)
        : await fetchUserLeadRecommendations({ page, pageSize: PAGE_SIZE });
      if (response?.data?.length) {
        setItems(response.data);
      } else {
        setItems([]);
      }
      const pageCount = response?.meta?.pagination?.pageCount ?? 1;
      setTotalPages(Math.max(1, pageCount));
    } catch (message: string | any) {
      setErrorMessage(message);
      setHasError(true);
      setItems([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchLeadRecommendations(activePage);
  }, [isAuthenticated, activePage]);

  useMemo(() => totalPages, [totalPages]);

  const handlePageChange = (e: { selected: number }) => {
    setActivePage(e.selected + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-semibold mb-2">{STRING_DATA.RECOMMENDATIONS}</h1>
        <p className="text-sm">Please login to view your recommendations.</p>
      </div>
    );
  }

  const renderContainer = () => {
    if (isLoading) {
      return (
        <div className="mb-6">
          <SkeltonAuctionCard />
        </div>
      )
    }
    if (hasError || items.length === 0) {
      return (
        <div className=" p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-2">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Start Customizing Your Experience
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Update your interests — like cities, categories, alerts, or favorite lists — to start receiving personalized recommendations and notifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                href={ROUTE_CONSTANTS.PROFILE}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-color text-white font-medium rounded-lg  transition-colors"
              >
                Update Interests
              </Link>
              <Link
                href={ROUTE_CONSTANTS.MANAGE_ALERT}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-color text-white font-medium rounded-lg transition-colors"
              >
                Create Alerts
              </Link>
              <Link
                href={ROUTE_CONSTANTS.MANAGE_LIST}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-color text-white font-medium rounded-lg transition-colors"
              >
                Manage Lists
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return (
      <>
        <p className="text-sm text-gray-600 mb-6">
          These recommendations are based on your Interested Cities and Interested Categories.
        </p>
        <div className="grid grid-cols-1 gap-4">
          {items.map((item: LeadNoticeRecommendation, idx) => {
            return <AuctionCard2 key={`${item.id}-${idx}`} property={item as any} />;
          })}
        </div>
        <ReactPagination
          activePage={activePage}
          totalPage={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    )
  }

  return (
    <div className="common-section container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">{STRING_DATA.RECOMMENDATIONS}</h1>

      {renderContainer()}

    </div>
  );
}


