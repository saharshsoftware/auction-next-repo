"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";
import { COOKIES, STRING_DATA } from "@/shared/Constants";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import { LeadRecommendationItem } from "@/types";
import { getStaticTopRecommendations } from "@/data/user-recommendations";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/components/atoms/slickslider.style.css";
import { NextArrow, PrevArrow } from "../atoms/CustomReactCarousel";

const HomeRecommendationsClient: React.FC = () => {
  const [items, setItems] = useState<LeadRecommendationItem[]>([]);
  const isAuthenticated = Boolean(getCookie(COOKIES.TOKEN_KEY));

  useEffect(() => {
    if (!isAuthenticated) return;

    // for api data; fetchUserLeadRecommendations call
    const top10 = getStaticTopRecommendations(10);
    setItems(top10);
  }, [isAuthenticated]);

  if (!isAuthenticated || items.length === 0) return null;

  const settings: Settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    // adaptiveHeight: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 2048,
        settings: { slidesToShow: 3, slidesToScroll: 2, infinite: false, dots: true, arrows: true, adaptiveHeight: false },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, infinite: false, dots: true, arrows: false },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: true },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: true },
      },
    ],
  };

  return (
    <section className="py-20 bg-even-color section-class">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold">{STRING_DATA.RECOMMENDATIONS}</h2>

        <Link
          href={ROUTE_CONSTANTS.USER_RECOMMENDATIONS}
          className="text-sm text-blue-600 hover:underline mt-2 md:mt-0"
        >
          {STRING_DATA.VIEW_ALL_RECOMMENDATIONS}
        </Link>
      </div>
      <div className="slides-container">
        <Slider {...settings} lazyLoad="ondemand">
          {items.map((item, idx) => {
            const n = item.notice;
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
            } as any;
            return (
              <div key={idx} className="">
                <div className="h-full ">
                  <AuctionCard2 property={property} forceMobileNoImage={true} />
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default HomeRecommendationsClient;


