"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { LeadRecommendationItem } from "@/types";
import { getStaticTopRecommendations } from "@/data/user-recommendations";
import ReactPagination from "@/components/atoms/PaginationComp";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";

const PAGE_SIZE = 10;

export default function UserRecommendationsPage() {
  const [items, setItems] = useState<LeadRecommendationItem[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const isAuthenticated = Boolean(getCookie(COOKIES.TOKEN_KEY));

  useEffect(() => {
    if (!isAuthenticated) return;
    // For demo, create a larger list by repeating static items
    const top = getStaticTopRecommendations(10);
    const multiplied = Array.from({ length: 6 })
      .map(() => top)
      .flat();
    setItems(multiplied);
  }, [isAuthenticated]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  }, [items.length]);

  const paginatedItems = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return items.slice(start, end);
  }, [items, activePage]);

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

  return (
    <div className="common-section container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">{STRING_DATA.RECOMMENDATIONS}</h1>
      <p className="text-sm text-gray-600 mb-6">
        These recommendations are based on your Interested Cities and Interested Categories.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {paginatedItems.map((it, idx) => {
          const n = it.notice;
          const property = {
            id: String(n.id),
            title: n.title,
            bankName: n.bankName,
            branchName: n.branchName,
            assetCategory: n.assetCategory,
            reservePrice: n.reservePrice,
            emd: n.emd,
            city: n.city,
            state: n.state,
            slug: n.slug || undefined,
            noticeLink: n.noticeLink,
          } as any; // IAuction compatible minimal shape
          return <AuctionCard2 key={`${it.id}-${idx}`} property={property} />;
        })}
      </div>
      <ReactPagination
        activePage={activePage}
        totalPage={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}


