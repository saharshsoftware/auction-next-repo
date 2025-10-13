"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getCookie } from "cookies-next";
import { COOKIES, FEATURE_FLAGS, STRING_DATA } from "@/shared/Constants";
import { AuctionCard2 } from "@/components/atoms/AuctionCard2";
import { LeadNoticeRecommendation } from "@/types";
import { getStaticTopRecommendations } from "@/data/user-recommendations";
import Link from "next/link";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/components/atoms/slickslider.style.css";
import { NextArrow, PrevArrow } from "../atoms/CustomReactCarousel";
import SkeltonAuctionCard from "@/components/skeltons/SkeltonAuctionCard";
import { fetchUserLeadRecommendations } from "@/services/auction";

const HomeRecommendationsClient: React.FC = () => {
  const [items, setItems] = useState<LeadNoticeRecommendation[]>([]);
  const isAuthenticated = Boolean(getCookie(COOKIES.TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);


  const fetchLeadRecommendations = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      if (FEATURE_FLAGS.USE_STATIC_RECOMMENDATIONS) {
        const top10 = getStaticTopRecommendations(10);
        setItems(top10);
        return;
      }
      const top10 = await fetchUserLeadRecommendations({ page: 1, pageSize: 10 });
      if (top10?.data?.length) {
        setItems(top10.data.slice(0, 10));
      } else {
        setItems([]);
      }
    } catch (e) {
      setHasError(true);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchLeadRecommendations();
    // for api data; fetchUserLeadRecommendations call
    // const top10 = getStaticTopRecommendations(10);
    // setItems(top10);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

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
        {isLoading && (
          <div className="mb-6">
            <SkeltonAuctionCard />
          </div>
        )}
        {hasError && !isLoading && (
          <div className="mb-4 text-sm text-red-600">Failed to load recommendations. Please try again.</div>
        )}
        <Slider {...settings} lazyLoad="ondemand">
          {items.map((item, idx) => {
            return (
              <div key={idx} className="">
                <div className="h-full ">
                  <AuctionCard2 property={item as any} forceMobileNoImage={true} />
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


